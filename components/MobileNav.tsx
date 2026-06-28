'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function MobileNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  useEffect(() => {
    const btn = document.getElementById('mob-btn');
    const drawer = document.getElementById('mob-drawer');
    const backdrop = document.getElementById('mob-backdrop');

    function openNav() {
      drawer!.style.display = 'flex';
      backdrop!.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      drawer!.style.display = 'none';
      backdrop!.style.display = 'none';
      document.body.style.overflow = '';
    }

    btn?.addEventListener('click', openNav);
    backdrop?.addEventListener('click', closeNav);

    return () => {
      btn?.removeEventListener('click', openNav);
      backdrop?.removeEventListener('click', closeNav);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* Hamburger */}
      <button
        id="mob-btn"
        aria-label="Open menu"
        style={{
          marginLeft: 'auto',
          display: 'none',
          flexDirection: 'column',
          gap: 5,
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          background: 'none',
          border: 'none',
          padding: 0,
        }}
      >
        <span style={{ display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2 }} />
        <span style={{ display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2 }} />
        <span style={{ display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2 }} />
      </button>

      {/* Backdrop */}
      <div
        id="mob-backdrop"
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
        }}
      />

      {/* Drawer */}
      <nav
        id="mob-drawer"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 280,
          background: 'var(--forest)',
          zIndex: 201,
          overflowY: 'auto',
          padding: '64px 24px 32px',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Link href="/how-it-works" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, padding: '10px 12px', borderRadius: 8, display: 'block' }}>How it works</Link>
        <Link href="/pricing" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, padding: '10px 12px', borderRadius: 8, display: 'block' }}>Pricing</Link>
        <Link href="/faq" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, padding: '10px 12px', borderRadius: 8, display: 'block' }}>FAQ</Link>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', padding: '4px 12px' }}>Guides</div>
        <Link href="/off-market-property" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, padding: '10px 12px', borderRadius: 8, display: 'block' }}>Off-market property</Link>
        <Link href="/approach-a-homeowner" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, padding: '10px 12px', borderRadius: 8, display: 'block' }}>Approach a homeowner</Link>
        <Link href="/sell-without-an-estate-agent" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, padding: '10px 12px', borderRadius: 8, display: 'block' }}>Sell without an agent</Link>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

        {isLoggedIn ? (
          <>
            <Link href="/account" style={{ display: 'block', background: 'var(--gold)', color: 'var(--forest)', fontWeight: 600, fontSize: 14, padding: '12px 16px', borderRadius: 8, textAlign: 'center', marginTop: 8 }}>My account</Link>
            <Link href="/api/auth/signout" style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 14, padding: '10px 12px', textAlign: 'center' }}>Sign out</Link>
          </>
        ) : (
          <>
            <Link href="/register" style={{ display: 'block', background: 'var(--gold)', color: 'var(--forest)', fontWeight: 600, fontSize: 14, padding: '12px 16px', borderRadius: 8, textAlign: 'center', marginTop: 8 }}>Register interest</Link>
            <Link href="/register?intent=seller" style={{ display: 'block', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', fontSize: 14, padding: '11px 16px', borderRadius: 8, textAlign: 'center', marginTop: 8 }}>Check buyer demand</Link>
            <Link href="/login" style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 14, padding: '10px 12px', textAlign: 'center' }}>Sign in</Link>
          </>
        )}
      </nav>

      {/* Show hamburger on mobile via CSS */}
      <style>{`
        @media (max-width: 900px) {
          #mob-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
