import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const body = await req.json() as {
      action?: string;
      interestId?: string;
      propertyId?: string;
    };
    const { action, interestId, propertyId } = body;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.earlyeggs.com';
    const stripe = getStripe();

    // ── Owner approach ────────────────────────────────────────────────────────
    if (action === 'owner_approach') {
      if (!interestId) {
        return NextResponse.json({ error: 'Missing interestId' }, { status: 400 });
      }

      const { data: interest } = await supabase
        .from('buyer_interests')
        .select('id, interest_type, full_address, postcode, approach_requested')
        .eq('id', interestId)
        .eq('user_id', user.id)
        .single() as {
          data: {
            id: string;
            interest_type: string;
            full_address: string | null;
            postcode: string | null;
            approach_requested: boolean;
          } | null;
          error: unknown;
        };

      if (!interest) return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
      if (interest.interest_type !== 'specific_property') {
        return NextResponse.json({ error: 'Owner approach is only available for specific property interests' }, { status: 400 });
      }
      if (interest.approach_requested) {
        return NextResponse.json({ error: 'Owner approach already requested' }, { status: 400 });
      }

      const propertyLabel = interest.full_address ?? interest.postcode ?? 'your target property';

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'gbp',
            unit_amount: 2900,
            product_data: {
              name: 'Owner approach — private letter',
              description: `We identify the registered owner of ${propertyLabel} and send a personally addressed letter on your behalf.`,
            },
          },
          quantity: 1,
        }],
        metadata: { action: 'owner_approach', interest_id: interestId, user_id: user.id },
        customer_email: user.email,
        success_url: `${baseUrl}/account/interests/${interestId}/approach/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/account/interests/${interestId}/approach`,
      });

      return NextResponse.json({ url: session.url });
    }

    // ── Seller broadcast ──────────────────────────────────────────────────────
    if (action === 'seller_broadcast') {
      if (!propertyId) {
        return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
      }

      const { data: property } = await supabase
        .from('seller_properties')
        .select('id, full_address, postcode, status, broadcast_paid_at')
        .eq('id', propertyId)
        .eq('user_id', user.id)
        .single() as {
          data: {
            id: string;
            full_address: string;
            postcode: string;
            status: string;
            broadcast_paid_at: string | null;
          } | null;
          error: unknown;
        };

      if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      if (property.status !== 'available') {
        return NextResponse.json({ error: 'Property is not available for broadcast' }, { status: 400 });
      }
      if (property.broadcast_paid_at) {
        return NextResponse.json({ error: 'Broadcast already purchased for this property' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'gbp',
            unit_amount: 4900,
            product_data: {
              name: 'Buyer broadcast — 30 days',
              description: `Reach buyers within 2 miles of ${property.full_address} who aren't already matched to your property.`,
            },
          },
          quantity: 1,
        }],
        metadata: { action: 'seller_broadcast', property_id: propertyId, user_id: user.id },
        customer_email: user.email,
        success_url: `${baseUrl}/account/properties/${propertyId}/broadcast/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/account/properties/${propertyId}/broadcast`,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
