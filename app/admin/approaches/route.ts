import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/adminAuth';

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSessionToken(token);
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json() as {
      id: string;
      owner_name?: string | null;
      owner_address?: string | null;
      owner_postcode?: string | null;
      letter_sent_date?: string | null;
      status?: string;
      admin_notes?: string | null;
    };

    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const supabase = getSupabaseServiceClient();

    const update: Record<string, unknown> = { ...fields };

    // If marking as letter_sent, auto-update buyer_interests approach_status
    if (fields.status === 'letter_sent') {
      update.letter_sent_date = fields.letter_sent_date ?? new Date().toISOString().slice(0, 10);
    }

    const { data: approach, error: fetchError } = await supabase
      .from('owner_approaches')
      .select('buyer_interest_id')
      .eq('id', id)
      .single() as { data: { buyer_interest_id: string } | null; error: unknown };

    if (fetchError || !approach) {
      return NextResponse.json({ error: 'Approach not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('owner_approaches')
      .update(update)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Keep buyer_interests.approach_status in sync
    const approachStatusMap: Record<string, string> = {
      letter_sent: 'letter_sent',
      awaiting_response: 'letter_sent',
      responded: 'responded',
      no_response: 'no_response',
      opted_out: 'opted_out',
    };

    if (fields.status && approachStatusMap[fields.status]) {
      await supabase
        .from('buyer_interests')
        .update({ approach_status: approachStatusMap[fields.status] })
        .eq('id', approach.buyer_interest_id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin approaches PATCH error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
