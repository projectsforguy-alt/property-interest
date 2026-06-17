import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { normalisePostcode, postcodeDistrict } from '@/lib/types';

export async function GET(req: NextRequest) {
  const postcode = req.nextUrl.searchParams.get('postcode');
  if (!postcode) return NextResponse.json({ error: 'Postcode required' }, { status: 400 });

  const normalised = normalisePostcode(postcode);
  const district = postcodeDistrict(normalised);
  const supabase = getSupabaseServiceClient();

  // Count exact postcode matches
  const { count: exactCount } = await supabase
    .from('buyer_interests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('postcode', normalised);

  // Count district-level matches
  const { count: districtCount } = await supabase
    .from('buyer_interests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .ilike('postcode', `${district}%`);

  const ec = exactCount ?? 0;
  const dc = (districtCount ?? 0) - ec; // area count excludes exact matches

  return NextResponse.json({
    exactCount: ec,
    areaCount: dc,
    hasInterest: ec + dc > 0,
  });
}
