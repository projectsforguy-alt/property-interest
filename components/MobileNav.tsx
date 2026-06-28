'use client';

import { useEffect, useRef } from 'react';
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
  const pathname = usePathname();
  const drawerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  function isOpen() {
    return drawerRef.current?.getAttribute('data-open') === 'true';
  }

  function open() {
    drawerRef.current?.setAttribute('data-open', 'true');
    backdropRef.current?.setAttribute('data-open', 'true');
    iconRef.current?.classList.add('mobile-nav-icon--open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    drawerRef.current?.setAttribute('data-open', 'false');
    backdropRef.current?.setAttribute('data-open', 'false');
    iconRef.current?.classList.remove('mobile-nav-icon--open');
    document.body.style.overflow = '';
  }

  function toggle() {
    isOpen() ? close() : open();
  }

  // Close on route change
  useEffect(() => { close(); }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        className="mobile-nav-toggle"
        onClick={toggle}
        aria-label="Open menu"
      >
        <span ref={iconRef} className="mobile-nav-icon">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        ref={backdropRef}
        data-open="false"
        onClick={close}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'none',
        }}
      />

      <nav
        ref={drawerRef}
        data-open="false"
        aria-label="Mobile navigation"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 280,
          background: 'var(--forest)',
          zIndex: 201,
          overflowY: 'auto',
          padding: 'var(--space-16) var(--space-6) var(--space-8)',
          display: 'none',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        {NAV.map((group) => (
          <div key={group.label} className="mobile-nav-group">
            <div className="mobile-nav-group-label">{group.label}</div>
            {group.links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="mobile-nav-link"
                onClick={close}
              >
                {label}
              </Link>
            ))}
          </div>
        ))}

        <div className="mobile-nav-actions">
          {isLoggedIn ? (
            <>
              <Link href="/account" className="btn btn-primary w-full" onClick={close}>
                My account
              </Link>
              <Link
                href="/api/auth/signout"
                className="btn btn-ghost w-full"
                style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)' }}
                onClick={close}
              >
                Sign out
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary w-full" onClick={close}>
                Register buying interest
              </Link>
              <div className="mobile-nav-seller-group">
                <div className="mobile-nav-group-label" style={{ paddingLeft: 0, paddingTop: 'var(--space-2)' }}>
                  I&apos;m a seller
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <Link href="/register?intent=seller" className="btn btn-outline w-full" onClick={close}>
                    Check buyer demand
                  </Link>
                </div>
              </div>
              <Link
                href="/login"
                className="btn btn-ghost w-full"
                style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)' }}
                onClick={close}
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>

      <style>{`
        [data-open="true"] { display: flex !important; }
      `}</style>
    </>
  );
}
