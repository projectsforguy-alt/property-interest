'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function MobileNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const drawerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On client mount, ensure drawer is properly hidden
    if (drawerRef.current) {
      drawerRef.current.style.visibility = 'hidden';
      drawerRef.current.style.opacity = '0';
      drawerRef.current.style.pointerEvents = 'none';
    }
    if (backdropRef.current) {
      backdropRef.current.style.display = 'none';
    }
  }, []);

  function openNav() {
    if (drawerRef.current) {
      drawerRef.current.style.visibility = 'visible';
      drawerRef.current.style.opacity = '1';
      drawerRef.current.style.pointerEvents = 'auto';
    }
    if (backdropRef.current) {
      backdropRef.current.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (drawerRef.current) {
      drawerRef.current.style.visibility = 'hidden';
      drawerRef.current.style.opacity = '0';
      drawerRef.current.style.pointerEvents = 'none';
    }
    if (backdropRef.current) {
      backdropRef.current.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  const linkStyle = {
    color: 'rgba(255,255,255,0.8)' as const,
    fontSize: 15,
    padding: '10px 12px',
    borderRadius: 8,
    display: 'block' as const,
  };

  return (
    <>
      {/* Hamburger — only visible on mobile via CSS class */}
      <button
        onClick={openNav}
        className="mobile-nav-toggle"
        aria-label="Open menu"
      >
        <span className="mobile-nav-icon">
          <span /><span /><span />
        </span>
      </button>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={closeNav}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9998,
        }}
      />

      {/* Drawer — starts hidden via visibility so SSR doesn't show it */}
      <nav
        ref={drawerRef}
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 280,
          background: 'var(--forest)',
          zIndex: 9999,
          overflowY: 'auto',
          padding: '64px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <Link href="/how-it-works" style={linkStyle} onClick={closeNav}>How it works</Link>
        <Link href="/pricing" style={linkStyle} onClick={closeNav}>Pricing</Link>
        <Link href="/faq" style={linkStyle} onClick={closeNav}>FAQ</Link>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', padding: '4px 12px' }}>Guides</div>
        <Link href="/off-market-property" style={linkStyle} onClick={closeNav}>Off-market property</Link>
        <Link href="/approach-a-homeowner" style={linkStyle} onClick={closeNav}>Approach a homeowner</Link>
        <Link href="/sell-without-an-estate-agent" style={linkStyle} onClick={closeNav}>Sell without an agent</Link>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
        {isLoggedIn ? (
          <>
            <Link href="/account" onClick={closeNav} style={{ display: 'block', background: 'var(--gold)', color: 'var(--forest)', fontWeight: 600, fontSize: 14, padding: '12px 16px', borderRadius: 8, textAlign: 'center' as const, marginTop: 8 }}>My account</Link>
            <Link href="/api/auth/signout" style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 14, padding: '10px 12px', textAlign: 'center' as const }}>Sign out</Link>
          </>
        ) : (
          <>
            <Link href="/register" onClick={closeNav} style={{ display: 'block', background: 'var(--gold)', color: 'var(--forest)', fontWeight: 600, fontSize: 14, padding: '12px 16px', borderRadius: 8, textAlign: 'center' as const, marginTop: 8 }}>Register interest</Link>
            <Link href="/register?intent=seller" onClick={closeNav} style={{ display: 'block', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', fontSize: 14, padding: '11px 16px', borderRadius: 8, textAlign: 'center' as const, marginTop: 8 }}>Check buyer demand</Link>
            <Link href="/login" onClick={closeNav} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 14, padding: '10px 12px', textAlign: 'center' as const }}>Sign in</Link>
          </>
        )}
      </nav>
    </>
  );
}
