import { getSupabaseServerClient } from '@/lib/supabase';
import ProfileForm from './ProfileForm';
import type { Profile } from '@/lib/types';

export const metadata = { title: 'Profile & settings | Intentory' };

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Profile &amp; settings</h1>
          <p className="account-page-sub">Update your buying profile and alert preferences.</p>
        </div>
      </div>
      <ProfileForm profile={data as Profile} email={user!.email ?? ''} />
    </>
  );
}
