import type { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Register interest | Intentory',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Register buying interest</div>
          <p className="auth-sub">
            Free to join. Register where you want to buy and we&apos;ll alert you when a matching opportunity appears.
          </p>
        </div>
        <RegisterForm />
        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
