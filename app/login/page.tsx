import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in | Intentory',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Welcome back</div>
          <p className="auth-sub">Sign in to manage your interests and properties.</p>
        </div>
        <LoginForm />
        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/register">Register free</Link>
        </div>
      </div>
    </div>
  );
}
