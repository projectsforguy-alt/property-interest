import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const body = await req.json() as { propertyId: string; action: string; code?: string };
    const { propertyId, action, code } = body;

    // Confirm this property belongs to this user
    const { data: property } = await supabase
      .from('seller_properties')
      .select('id, verification_status, verification_code')
      .eq('id', propertyId)
      .eq('user_id', user.id)
      .single() as {
        data: { id: string; verification_status: string; verification_code: string | null } | null;
        error: unknown;
      };

    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    if (action === 'request_letter') {
      if (property.verification_status !== 'unverified') {
        return NextResponse.json({ error: 'Letter already requested' }, { status: 400 });
      }

      await supabase
        .from('seller_properties')
        .update({
          verification_status: 'letter_requested',
          verification_letter_requested_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      return NextResponse.json({ ok: true });
    }

    if (action === 'submit_code') {
      if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

      if (!['letter_sent', 'awaiting_code'].includes(property.verification_status)) {
        return NextResponse.json({ error: 'Not awaiting a code' }, { status: 400 });
      }

      // Use service client to read the verification_code (RLS won't expose it)
      const serviceClient = getSupabaseServiceClient();
      const { data: full } = await serviceClient
        .from('seller_properties')
        .select('verification_code')
        .eq('id', propertyId)
        .single() as { data: { verification_code: string | null } | null; error: unknown };

      if (!full?.verification_code || full.verification_code !== code.trim()) {
        return NextResponse.json({ error: 'Incorrect code' }, { status: 400 });
      }

      await serviceClient
        .from('seller_properties')
        .update({
          verified: true,
          verification_status: 'verified',
          verification_code_entered_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Verify route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
