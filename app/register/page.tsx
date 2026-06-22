import type { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create your free account | Intentory',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ intent?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { intent } = await searchParams;
  const isSeller = intent === 'seller';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">
            {isSeller ? 'List your property privately' : 'Register buying interest'}
          </div>
          <p className="auth-sub">
            {isSeller
              ? 'Create a free account to register your property and connect with matched buyers — no public listing required.'
              : 'Free to join. Register where you want to buy and we\'ll alert you when a matching opportunity appears.'}
          </p>
        </div>

        <RegisterForm intent={isSeller ? 'seller' : 'buyer'} />

        {isSeller && (
          <div style={{
            background: 'var(--teal-soft)',
            border: '1px solid var(--teal)',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-4)',
            marginTop: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--slate)',
            lineHeight: 1.6,
          }}>
            One account works for both buyers and sellers. Once registered, you can check demand, register your property, and manage everything from your dashboard.
          </div>
        )}

        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
