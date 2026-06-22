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

export default function MobileNav() {
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
          <Link href="/sellers/check" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
            I&apos;m a seller — check demand
          </Link>
          <Link href="/register" className="btn btn-outline w-full" onClick={() => setOpen(false)}>
            Register buying interest
          </Link>
          <Link href="/login" className="btn btn-ghost w-full" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)' }} onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </div>
      </nav>
    </>
  );
}
