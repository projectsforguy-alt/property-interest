import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { generateResponseCode } from '@/lib/supabase';
import { sendApproachConfirmation } from '@/lib/loops';

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
  const { action, interest_id, user_id } = session.metadata ?? {};

  if (!action || !interest_id || !user_id) {
    console.error('Webhook: missing metadata', session.metadata);
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  if (action === 'owner_approach') {
    // Idempotency: check if already processed
    const { data: existing } = await supabase
      .from('owner_approaches')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Fetch the interest
    const { data: interest } = await supabase
      .from('buyer_interests')
      .select('id, full_address, postcode, user_id')
      .eq('id', interest_id)
      .eq('user_id', user_id)
      .single() as { data: { id: string; full_address: string | null; postcode: string | null; user_id: string } | null; error: unknown };

    if (!interest) {
      console.error('Webhook: interest not found', { interest_id, user_id });
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }

    const responseCode = generateResponseCode();

    // Create the owner_approaches record
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

    // Mark the interest as approach requested
    await supabase
      .from('buyer_interests')
      .update({
        approach_requested: true,
        approach_paid_at: new Date().toISOString(),
        approach_status: 'paid',
        last_active_at: new Date().toISOString(),
      })
      .eq('id', interest_id);

    // Send confirmation email via Loops
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user_id)
      .single() as { data: { first_name: string | null } | null; error: unknown };

    const { data: authUser } = await supabase.auth.admin.getUserById(user_id);
    const email = authUser?.user?.email;
    const firstName = profile?.first_name ?? 'there';
    const address = interest.full_address ?? interest.postcode ?? 'your target property';

    if (email) {
      await sendApproachConfirmation(email, firstName, address);
    }
  }

  return NextResponse.json({ ok: true });
}
