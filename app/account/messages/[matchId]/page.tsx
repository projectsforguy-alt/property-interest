import { notFound, redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { Message } from '@/lib/types';
import MessageThread from './MessageThread';

export default async function MessageThreadPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: match } = await supabase
    .from('matches')
    .select('*, buyer_interests(*), seller_properties(*)')
    .eq('id', matchId)
    .or(`buyer_user_id.eq.${user.id},seller_user_id.eq.${user.id}`)
    .single();

  if (!match) notFound();

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  // Mark messages as read
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .neq('sender_id', user.id)
    .is('read_at', null);

  const property = match.seller_properties as Record<string, string> | null;
  const interest = match.buyer_interests as Record<string, string> | null;
  const title = property?.full_address ?? interest?.full_address ?? interest?.street_name ?? 'Property conversation';

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title" style={{ fontSize: 'var(--text-xl)' }}>{title}</h1>
          <p className="account-page-sub">Private conversation</p>
        </div>
      </div>
      <MessageThread matchId={matchId} userId={user.id} initialMessages={(messages ?? []) as Message[]} />
    </>
  );
}
