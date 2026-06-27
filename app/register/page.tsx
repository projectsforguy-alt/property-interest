import type { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create your free account | EarlyEggs',
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
            {isSeller ? 'See who wants to buy your home' : 'Register buying interest'}
          </div>
          <p className="auth-sub">
            {isSeller
              ? 'Create a free account to check buyer demand at your address and connect with interested buyers — privately, and with no commitment to sell.'
              : "Free to join. Register where you want to buy and we'll alert you when a matching opportunity appears."}
          </p>
        </div>

        <RegisterForm intent={isSeller ? 'seller' : 'buyer'} />

        {isSeller && (
          <div style={{
            background: 'var(--gold-soft)',
            border: '1px solid var(--gold)',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-4)',
            marginTop: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--slate)',
            lineHeight: 1.6,
          }}>
            One account works for both buyers and sellers. Once registered, you can check demand, see matched buyers, and manage everything from your dashboard — no obligation to proceed.
          </div>
        )}

        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </div>

        <div className="auth-footer" style={{ marginTop: 'var(--space-2)' }}>
          {isSeller ? (
            <>
              Looking to buy instead?{' '}
              <Link href="/register">Register as a buyer</Link>
            </>
          ) : (
            <>
              Are you a homeowner?{' '}
              <Link href="/register?intent=seller">Check buyer demand</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
