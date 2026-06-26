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
      verification_code?: string | null;
      verification_status?: string;
      verified?: boolean;
      verification_letter_sent_at?: string;
      admin_notes?: string | null;
    };

    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const supabase = getSupabaseServiceClient();

    const { error } = await supabase
      .from('seller_properties')
      .update(fields)
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin sellers PATCH error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
