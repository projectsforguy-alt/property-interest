import { notFound, redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { SellerProperty } from '@/lib/types';
import VerifyPropertyClient from './VerifyPropertyClient';

export const metadata = { title: 'Verify property | EarlyEggs' };

export default async function VerifyPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('seller_properties')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) notFound();
  const property = data as SellerProperty;

  return <VerifyPropertyClient property={property} />;
}
