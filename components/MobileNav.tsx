'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/off-market-property', label: 'Off-market property' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
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

      {/* Backdrop */}
      {open && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <nav
        className={`mobile-nav-drawer${open ? ' mobile-nav-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav-links">
          {NAV_LINKS.map(({ href, label }) => (
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

        <div className="mobile-nav-actions">
          <Link href="/login" className="btn btn-outline w-full" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link href="/register" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
            Register interest free
          </Link>
        </div>
      </nav>
    </>
  );
}
