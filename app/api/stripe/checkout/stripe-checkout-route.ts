import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const body = await req.json() as { interestId?: string; action?: string };
    const { interestId, action } = body;

    if (!interestId || action !== 'owner_approach') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the interest belongs to this user and is a specific_property
    const { data: interest } = await supabase
      .from('buyer_interests')
      .select('id, interest_type, full_address, postcode, approach_requested')
      .eq('id', interestId)
      .eq('user_id', user.id)
      .single();

    if (!interest) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }
    if (interest.interest_type !== 'specific_property') {
      return NextResponse.json({ error: 'Owner approach is only available for specific property interests' }, { status: 400 });
    }
    if (interest.approach_requested) {
      return NextResponse.json({ error: 'Owner approach already requested for this interest' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.earlyeggs.com';
    const propertyLabel = interest.full_address ?? interest.postcode ?? 'your target property';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: 2900, // £29 in pence
            product_data: {
              name: 'Owner approach — private letter',
              description: `We identify the registered owner of ${propertyLabel} and send a personally addressed letter on your behalf with a private response link.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        action: 'owner_approach',
        interest_id: interestId,
        user_id: user.id,
      },
      customer_email: user.email,
      success_url: `${baseUrl}/account/interests/${interestId}/approach/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/account/interests/${interestId}/approach`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
