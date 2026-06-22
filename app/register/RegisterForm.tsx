'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface Props {
  intent?: 'buyer' | 'seller';
}

export default function RegisterForm({ intent = 'buyer' }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSeller = intent === 'seller';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!consent) { setError('Please accept the terms to continue.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Send sellers to property registration, buyers to the main dashboard
      router.push(isSeller ? '/account/property/new?welcome=1' : '/account?welcome=1');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error-banner">{error}</div>}
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="firstName">First name</label>
          <input id="firstName" type="text" className="field-input" required
            value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="lastName">Last name</label>
          <input id="lastName" type="text" className="field-input" required
            value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="field-label" htmlFor="email">Email address</label>
        <input id="email" type="email" className="field-input" required
          value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="password">Password</label>
        <input id="password" type="password" className="field-input" required
          value={password} onChange={e => setPassword(e.target.value)}
          autoComplete="new-password" />
        <span className="field-hint">At least 8 characters</span>
      </div>
      <div className="checkbox-field">
        <input type="checkbox" id="consent" checked={consent}
          onChange={e => setConsent(e.target.checked)} />
        <label htmlFor="consent" className="checkbox-label">
          I agree to Intentory&apos;s{' '}
          <Link href="/terms">Terms of use</Link> and{' '}
          <Link href="/privacy">Privacy policy</Link>
        </label>
      </div>
      <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
        {loading
          ? 'Creating account…'
          : isSeller ? 'Create free account' : 'Create free account'}
      </button>
    </form>
  );
}
