'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    label: 'Main',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    label: 'Guides',
    links: [
      { href: '/off-market-property', label: 'Off-market property' },
      { href: '/approach-a-homeowner', label: 'Approach a homeowner' },
      { href: '/sell-without-an-estate-agent', label: 'Sell without an agent' },
    ],
  },
];

export default function MobileNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className={`mobile-nav-icon${open ? ' mobile-nav-icon--open' : ''}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`mobile-nav-drawer${open ? ' mobile-nav-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        {NAV.map((group) => (
          <div key={group.label} className="mobile-nav-group">
            <div className="mobile-nav-group-label">{group.label}</div>
            {group.links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`mobile-nav-link${pathname === href ? ' mobile-nav-link--active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        ))}

        <div className="mobile-nav-actions">
          {isLoggedIn ? (
            <>
              <Link href="/account" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
                My account
              </Link>
              <Link
                href="/api/auth/signout"
                className="btn btn-ghost w-full"
                style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)' }}
                onClick={() => setOpen(false)}
              >
                Sign out
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
                Register buying interest
              </Link>
              <div className="mobile-nav-seller-group">
                <div className="mobile-nav-group-label" style={{ paddingLeft: 0, paddingTop: 'var(--space-2)' }}>
                  I&apos;m a seller
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <Link href="/register?intent=seller" className="btn btn-outline w-full" onClick={() => setOpen(false)}>
                    Check buyer demand
                  </Link>
                </div>
              </div>
              <Link
                href="/login"
                className="btn btn-ghost w-full"
                style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)' }}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
