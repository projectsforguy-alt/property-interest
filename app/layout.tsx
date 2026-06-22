import type { Metadata } from 'next';
import { DM_Sans, Inter_Tight } from 'next/font/google';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import GuidesDropdown from '@/components/GuidesDropdown';
import './globals.css';

const display = DM_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const tight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-tight',
  weight: ['500', '600'],
  display: 'swap',
});

const BASE_URL = 'https://property-interest-sepia.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Intentory — The private property demand platform',
    template: '%s | Intentory',
  },
  description:
    'Intentory is the private property demand platform. Buyers register interest in specific homes, streets or areas for free. Sellers discover real buyer demand at their address — before going to market.',
  keywords: [
    'off-market property',
    'buy property not for sale',
    'private property purchase',
    'approach homeowner to buy house',
    'off market homes UK',
    'register property interest',
    'private house sale UK',
    'buy house not listed',
  ],
  authors: [{ name: 'Intentory' }],
  creator: 'Intentory',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: BASE_URL,
    siteName: 'Intentory',
    title: 'Intentory — The private property demand platform',
    description:
      'Buyers register interest in specific homes, streets or areas. Sellers discover real buyer demand at their address — before going to market.',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'Intentory — Private property demand platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intentory — The private property demand platform',
    description:
      'Buyers register interest in specific homes, streets or areas. Sellers discover real demand at their address before going to market.',
    images: ['/images/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Intentory',
  url: BASE_URL,
  description:
    'Intentory is the private property demand platform. Buyers register interest in specific homes, streets or areas for free. Sellers discover real buyer demand at their address — before going to market.',
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Intentory',
  url: BASE_URL,
  description: 'The private property demand platform.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/sellers/check?postcode={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${display.variable} ${tight.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
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

        {/* Desktop nav */}
        <nav className="site-nav" aria-label="Primary">
          <Link href="/how-it-works">How it works</Link>
          <GuidesDropdown />
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
        </nav>

        {/* Desktop actions */}
        <div className="header-actions">
          <Link href="/register?intent=seller" className="btn btn-ghost header-seller-cta">
            I&apos;m a seller
          </Link>
          <Link href="/login" className="btn btn-ghost">Sign in</Link>
          <Link href="/register" className="btn btn-primary">Register interest</Link>
        </div>

        {/* Mobile hamburger + drawer */}
        <MobileNav />
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
            <Link href="/off-market-property">Off-market property</Link>
            <Link href="/approach-a-homeowner">Approach a homeowner</Link>
            <Link href="/sell-without-an-estate-agent">Sell without an agent</Link>
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
