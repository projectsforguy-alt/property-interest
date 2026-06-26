import { notFound } from 'next/navigation';
import { getSupabaseServiceClient } from '@/lib/supabase';
import RespondPageClient from './RespondPageClient';

export const metadata = { title: 'Respond to property enquiry | EarlyEggs' };

export default async function RespondPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = getSupabaseServiceClient();

  // Verify the code exists and hasn't already been responded to
  const { data: approach } = await supabase
    .from('owner_approaches')
    .select('id, owner_response, status, contact_blocked_until')
    .eq('response_code', code)
    .single() as {
      data: {
        id: string;
        owner_response: string | null;
        status: string;
        contact_blocked_until: string | null;
      } | null;
      error: unknown;
    };

  if (!approach) notFound();

  // Already responded — show a neutral confirmation
  if (approach.owner_response) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', padding: 'var(--space-6)' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--forest)', marginBottom: 'var(--space-4)' }}>
            Already responded
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>
            We have already received a response for this enquiry. If you think this is an error, please contact us at hello@earlyeggs.com.
          </p>
        </div>
      </div>
    );
  }

  // Approach not yet paid/sent — shouldn't be accessible
  if (approach.status === 'pending_payment') {
    notFound();
  }

  return <RespondPageClient code={code} />;
}
