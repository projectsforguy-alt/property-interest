import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { normalisePostcode, postcodeDistrict } from '@/lib/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getSupabaseServiceClient();

  if (body.seller_property_id) {
    // A seller just registered — find matching buyer interests
    const { data: property } = await supabase
      .from('seller_properties').select('*').eq('id', body.seller_property_id).single();
    if (!property) return NextResponse.json({ ok: false });

    const postcode = normalisePostcode(property.postcode);
    const district = postcodeDistrict(postcode);

    // Find active buyer interests that overlap
    const { data: interests } = await supabase
      .from('buyer_interests')
      .select('*')
      .eq('status', 'active')
      .neq('user_id', property.user_id); // don't match with yourself

    for (const interest of (interests ?? [])) {
      let matchType: string | null = null;
      const iPostcode = normalisePostcode(interest.postcode ?? '');
      const iDistrict = postcodeDistrict(iPostcode);

      if (
        interest.interest_type === 'specific_property' &&
        interest.full_address &&
        normalisePostcode(interest.full_address).includes(postcode)
      ) {
        matchType = 'exact_address';
      } else if (
        interest.interest_type === 'street' &&
        interest.street_name &&
        property.street_name &&
        interest.street_name.toLowerCase() === property.street_name.toLowerCase() &&
        iDistrict === district
      ) {
        matchType = 'street';
      } else if (iPostcode === postcode) {
        matchType = 'postcode';
      } else if (iDistrict === district) {
        matchType = 'area';
      }

      if (matchType) {
        // Insert match if not already exists
        await supabase.from('matches').upsert({
          buyer_interest_id: interest.id,
          seller_property_id: property.id,
          buyer_user_id: interest.user_id,
          seller_user_id: property.user_id,
          match_type: matchType,
          status: 'notified',
          buyer_notified_at: new Date().toISOString(),
          seller_notified_at: new Date().toISOString(),
        }, { onConflict: 'buyer_interest_id,seller_property_id', ignoreDuplicates: true });

        // Update seller broadcast count
        try { await supabase.rpc('increment_broadcast_count', { property_id: property.id }); } catch { /* ignore */ }
      }
    }
  }

  if (body.user_id && !body.seller_property_id) {
    // A buyer just registered — check their interests against existing seller properties
    const { data: interests } = await supabase
      .from('buyer_interests')
      .select('*')
      .eq('user_id', body.user_id)
      .eq('status', 'active');

    for (const interest of (interests ?? [])) {
      const iPostcode = normalisePostcode(interest.postcode ?? '');
      const iDistrict = postcodeDistrict(iPostcode);

      const { data: properties } = await supabase
        .from('seller_properties')
        .select('*')
        .eq('status', 'available')
        .neq('user_id', body.user_id);

      for (const property of (properties ?? [])) {
        const pPostcode = normalisePostcode(property.postcode);
        const pDistrict = postcodeDistrict(pPostcode);
        let matchType: string | null = null;

        if (
          interest.interest_type === 'specific_property' &&
          interest.full_address &&
          normalisePostcode(interest.full_address).includes(pPostcode)
        ) {
          matchType = 'exact_address';
        } else if (
          interest.interest_type === 'street' &&
          interest.street_name && property.street_name &&
          interest.street_name.toLowerCase() === property.street_name.toLowerCase() &&
          iDistrict === pDistrict
        ) {
          matchType = 'street';
        } else if (iPostcode === pPostcode) {
          matchType = 'postcode';
        } else if (iDistrict === pDistrict) {
          matchType = 'area';
        }

        if (matchType) {
          await supabase.from('matches').upsert({
            buyer_interest_id: interest.id,
            seller_property_id: property.id,
            buyer_user_id: body.user_id,
            seller_user_id: property.user_id,
            match_type: matchType,
            status: 'notified',
            buyer_notified_at: new Date().toISOString(),
            seller_notified_at: new Date().toISOString(),
          }, { onConflict: 'buyer_interest_id,seller_property_id', ignoreDuplicates: true });
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
