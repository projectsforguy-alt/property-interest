import type { Metadata } from 'next';
import { Instrument_Serif, Inter, Inter_Tight } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const tight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-tight',
  weight: ['500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Intentory — The private property demand platform',
  description:
    'Register where you want to buy before a property comes to market. Intentory builds a private layer of buyer demand, helping homeowners understand hidden interest before they decide to sell.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${tight.variable}`}>
        <div className="site">
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <circle cx="10" cy="10" r="3" fill="#0F1F2E" />
              <circle cx="10" cy="10" r="7" stroke="#0F1F2E" strokeWidth="1.5" fill="none" />
            </svg>
          </span>
          Intentory
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
        <div className="header-actions">
          <Link href="/login" className="btn btn-ghost">Sign in</Link>
          <Link href="/register" className="btn btn-primary">Register interest</Link>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">Intentory</div>
            <p className="footer-brand-desc">
              The private property demand platform. Register buying intent, discover hidden seller interest, and connect before a property reaches the open market.
            </p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/register">Register interest</Link>
            <Link href="/sellers">For homeowners</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of use</Link>
          </nav>
        </div>
        <p className="footer-meta">
          Intentory is a private demand platform, not an estate agency. Registering interest does not create any legal obligation on either party. © {new Date().getFullYear()} Intentory.
        </p>
      </div>
    </footer>
  );
}
