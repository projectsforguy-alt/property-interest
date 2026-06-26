import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseServiceClient, generateResponseCode } from '@/lib/supabase';
import { sendApproachConfirmation, sendBroadcastConfirmation } from '@/lib/loops';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true });
  }

  const session = event.data.object;
  const { action, interest_id, property_id, user_id } = session.metadata ?? {};

  if (!action || !user_id) {
    console.error('Webhook: missing metadata', session.metadata);
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  // ── Owner approach ──────────────────────────────────────────────────────────
  if (action === 'owner_approach' && interest_id) {
    const { data: existing } = await supabase
      .from('owner_approaches')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (existing) return NextResponse.json({ ok: true, skipped: true });

    const { data: interest } = await supabase
      .from('buyer_interests')
      .select('id, full_address, postcode, user_id')
      .eq('id', interest_id)
      .eq('user_id', user_id)
      .single() as {
        data: { id: string; full_address: string | null; postcode: string | null; user_id: string } | null;
        error: unknown;
      };

    if (!interest) {
      console.error('Webhook: interest not found', { interest_id, user_id });
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }

    const responseCode = generateResponseCode();

    const { error: approachError } = await supabase
      .from('owner_approaches')
      .insert({
        buyer_interest_id: interest_id,
        buyer_user_id: user_id,
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent as string | null,
        payment_status: 'paid',
        price_pence: 2900,
        outreach_type: 'owner_approach',
        status: 'paid',
        response_code: responseCode,
      });

    if (approachError) {
      console.error('Webhook: failed to create approach', approachError);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    await supabase
      .from('buyer_interests')
      .update({
        approach_requested: true,
        approach_paid_at: new Date().toISOString(),
        approach_status: 'paid',
        last_active_at: new Date().toISOString(),
      })
      .eq('id', interest_id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user_id)
      .single() as { data: { first_name: string | null } | null; error: unknown };

    const { data: authUser } = await supabase.auth.admin.getUserById(user_id);
    const email = authUser?.user?.email;
    const firstName = profile?.first_name ?? 'there';
    const address = interest.full_address ?? interest.postcode ?? 'your target property';

    if (email) await sendApproachConfirmation(email, firstName, address);
  }

  // ── Seller broadcast ────────────────────────────────────────────────────────
  if (action === 'seller_broadcast' && property_id) {
    const { data: existing } = await supabase
      .from('seller_properties')
      .select('broadcast_paid_at')
      .eq('id', property_id)
      .single() as { data: { broadcast_paid_at: string | null } | null; error: unknown };

    if (existing?.broadcast_paid_at) return NextResponse.json({ ok: true, skipped: true });

    const now = new Date().toISOString();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await supabase
      .from('seller_properties')
      .update({
        broadcast_paid_at: now,
        broadcast_sent_at: now,
        broadcast_status: 'active',
        broadcast_expires_at: expiresAt.toISOString(),
      })
      .eq('id', property_id);

    // Find buyers within 2 miles who aren't already matched — simple postcode district match for now
    const { data: property } = await supabase
      .from('seller_properties')
      .select('postcode, full_address, user_id')
      .eq('id', property_id)
      .single() as {
        data: { postcode: string; full_address: string; user_id: string } | null;
        error: unknown;
      };

    if (property) {
      const district = property.postcode.replace(/\s?\d[A-Z]{2}$/, '').trim().toUpperCase();

      const { data: interests } = await supabase
        .from('buyer_interests')
        .select('id, user_id, postcode')
        .eq('status', 'active')
        .neq('user_id', property.user_id) as {
          data: { id: string; user_id: string; postcode: string | null }[] | null;
          error: unknown;
        };

      let broadcastCount = 0;

      for (const interest of (interests ?? [])) {
        if (!interest.postcode) continue;
        const iDistrict = interest.postcode.replace(/\s?\d[A-Z]{2}$/, '').trim().toUpperCase();
        if (iDistrict !== district) continue;

        // Check not already matched
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .eq('buyer_interest_id', interest.id)
          .eq('seller_property_id', property_id)
          .maybeSingle();

        if (existingMatch) continue;

        // Create a match
        await supabase.from('matches').insert({
          buyer_interest_id: interest.id,
          seller_property_id: property_id,
          buyer_user_id: interest.user_id,
          seller_user_id: property.user_id,
          match_type: 'area',
          status: 'notified',
          buyer_notified_at: now,
          seller_notified_at: now,
        });

        broadcastCount++;
      }

      // Update broadcast count
      await supabase
        .from('seller_properties')
        .update({ broadcast_buyer_count: broadcastCount })
        .eq('id', property_id);

      // Notify seller
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user_id)
        .single() as { data: { first_name: string | null } | null; error: unknown };

      const { data: authUser } = await supabase.auth.admin.getUserById(user_id);
      const email = authUser?.user?.email;
      const firstName = profile?.first_name ?? 'there';

      if (email) await sendBroadcastConfirmation(email, firstName, property.full_address, broadcastCount);
    }
  }

  return NextResponse.json({ ok: true });
}
