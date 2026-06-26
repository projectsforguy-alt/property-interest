import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import type { OwnerResponse } from '@/lib/types';
import { sendOwnerResponseAlert } from '@/lib/loops';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      code: string;
      response: OwnerResponse;
      message?: string;
    };

    const { code, response, message } = body;

    if (!code || !response) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validResponses: OwnerResponse[] = [
      'not_interested',
      'not_considering',
      'open_to_offer',
      'ready_to_connect',
    ];
    if (!validResponses.includes(response)) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();

    // Find the approach by response code
    const { data: approach } = await supabase
      .from('owner_approaches')
      .select('id, buyer_interest_id, buyer_user_id, status, owner_response')
      .eq('response_code', code)
      .single() as {
        data: {
          id: string;
          buyer_interest_id: string;
          buyer_user_id: string;
          status: string;
          owner_response: string | null;
        } | null;
        error: unknown;
      };

    if (!approach) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Already responded
    if (approach.owner_response) {
      return NextResponse.json({ error: 'Already responded' }, { status: 409 });
    }

    // Build the update
    const now = new Date().toISOString();
    const update: Record<string, unknown> = {
      owner_response: response,
      owner_response_at: now,
      owner_message: message ?? null,
      status: 'responded',
    };

    // Option 1: set 2-year contact block
    if (response === 'not_interested') {
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      update.contact_blocked_until = twoYearsFromNow.toISOString();
    }

    await supabase
      .from('owner_approaches')
      .update(update)
      .eq('id', approach.id);

    // Notify the buyer via Loops
    const { data: interest } = await supabase
      .from('buyer_interests')
      .select('full_address, postcode')
      .eq('id', approach.buyer_interest_id)
      .single() as { data: { full_address: string | null; postcode: string | null } | null; error: unknown };

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', approach.buyer_user_id)
      .single() as { data: { first_name: string | null } | null; error: unknown };

    const { data: authUser } = await supabase.auth.admin.getUserById(approach.buyer_user_id);
    const email = authUser?.user?.email;
    const firstName = profile?.first_name ?? 'there';
    const address = interest?.full_address ?? interest?.postcode ?? 'your target property';

    if (email) {
      await sendOwnerResponseAlert(email, firstName, address, response);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Respond route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
