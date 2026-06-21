import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing — Simple, one-off actions',
  description:
    'Registering property interest on Intentory is always free. Pay only when you take an active step — owner approach £29, street outreach £99, area outreach £199, seller broadcast £49.',
  alternates: {
    canonical: 'https://property-interest-sepia.vercel.app/pricing',
  },
  openGraph: {
    title: 'Pricing | Intentory',
    description:
      'Free to register. Pay only when you act — owner approach £29, street outreach £99, area outreach £199, seller broadcast £49.',
    url: 'https://property-interest-sepia.vercel.app/pricing',
  },
};

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Intentory — Private Property Demand Platform',
  description:
    'Intentory connects buyers who want a specific home with sellers who haven\'t listed yet. Register interest for free, or check real buyer demand at your address.',
  provider: {
    '@type': 'Organization',
    name: 'Intentory',
    url: 'https://property-interest-sepia.vercel.app',
  },
  serviceType: 'Property matching service',
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Register Buyer Interest',
      description: 'Register interest in a specific address, street, postcode, or area. Receive match alerts automatically.',
      price: '0',
      priceCurrency: 'GBP',
    },
    {
      '@type': 'Offer',
      name: 'Owner Approach',
      description: 'We contact the homeowner at your target address personally on your behalf with a letter.',
      price: '29',
      priceCurrency: 'GBP',
    },
    {
      '@type': 'Offer',
      name: 'Street Outreach',
      description: 'We send a personal letter to every homeowner on your target street.',
      price: '99',
      priceCurrency: 'GBP',
    },
    {
      '@type': 'Offer',
      name: 'Area Outreach',
      description: 'Broadcast your buying interest across a full postcode district or area.',
      price: '199',
      priceCurrency: 'GBP',
    },
    {
      '@type': 'Offer',
      name: 'Seller Broadcast',
      description: 'Notify all matched buyers that your property is privately available.',
      price: '49',
      priceCurrency: 'GBP',
    },
  ],
};

const BUYER_ACTIONS = [
  {
    name: 'Register interest',
    price: 'Free',
    priceNote: 'Always',
    description: 'Register buying interest in any address, street, postcode, or area. Receive match alerts when a seller registers at your location.',
    features: [
      'Unlimited interest registrations',
      'Automatic match alerts',
      'Private — never publicly visible',
      'Active until you remove it',
    ],
    cta: { label: 'Register free', href: '/register' },
    featured: false,
  },
  {
    name: 'Owner approach',
    price: '£29',
    priceNote: 'one-off',
    description: 'We research the registered owner of your target property and send a personally addressed letter on your behalf.',
    features: [
      'Owner identified via Land Registry',
      'Personally addressed letter sent',
      'Private response link for the owner',
      'You\'re notified of any response',
    ],
    cta: { label: 'Register to unlock', href: '/register' },
    featured: false,
  },
  {
    name: 'Street outreach',
    price: '£99',
    priceNote: 'one-off',
    description: 'A personal letter goes to every homeowner on your target street. Ideal when you want the road, not just one specific house.',
    features: [
      'Every owner on the street contacted',
      'Personally addressed to each owner',
      'Private response link per property',
      'You\'re notified of every response',
    ],
    cta: { label: 'Register to unlock', href: '/register' },
    featured: true,
  },
  {
    name: 'Area outreach',
    price: '£199',
    priceNote: 'one-off',
    description: 'Broadcast your interest across a full postcode district or defined area. Maximum reach for serious buyers with location flexibility.',
    features: [
      'Full postcode district or area covered',
      'Letters to all registered owners',
      'Private response links per property',
      'You\'re notified of every response',
    ],
    cta: { label: 'Register to unlock', href: '/register' },
    featured: false,
  },
];

const SELLER_ACTIONS = [
  {
    name: 'Check demand',
    price: 'Free',
    priceNote: 'Always',
    description: 'Enter your postcode and see instantly whether buyers have registered interest at your address, on your street, or in your area.',
    features: [
      'Instant demand check',
      'See interest at address, street, and area level',
      'No commitment required',
      'No account needed to check',
    ],
    cta: { label: 'Check demand', href: '/sellers/check' },
    featured: false,
  },
  {
    name: 'Seller broadcast',
    price: '£49',
    priceNote: 'one-off',
    description: 'Notify every matched buyer in our database that your property is privately available — before any public listing.',
    features: [
      'All matched buyers notified',
      'Matches at address, street, postcode, and area level',
      'No public listing created',
      'You control whether to proceed',
    ],
    cta: { label: 'Register to unlock', href: '/register' },
    featured: true,
  },
];

const FAQ_ITEMS = [
  {
    q: 'Are there any subscription fees?',
    a: 'No. Intentory has no subscription, no monthly fee, and no hidden charges. You pay only for the specific action you choose to take.',
  },
  {
    q: 'What if an owner doesn\'t respond to a letter?',
    a: 'If there\'s no response within a reasonable window, we\'ll let you know. You can then decide whether to wait longer, try a different approach, or move on.',
  },
  {
    q: 'Can I get a refund if I change my mind?',
    a: 'Paid actions involve work we begin immediately — owner research, letter production, and postage. As a result, we\'re unable to offer refunds once an action has been dispatched. Please contact us if you have concerns before an action begins.',
  },
  {
    q: 'Do I need an account to pay?',
    a: 'Yes. Paid actions are tied to your Intentory account so we can notify you of responses and manage your active interests.',
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

      <main className="site-main">

        {/* Hero */}
        <section className="section section-dark" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-16)' }}>
          <div className="container-narrow">
            <p className="section-label">Pricing</p>
            <h1 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              Simple, one-off actions.<br />No subscriptions.
            </h1>
            <p className="section-sub section-sub-light" style={{ marginBottom: 0 }}>
              Registering interest is always free. You only pay when you choose to take an active step — and every action is a one-off payment, not a recurring charge.
            </p>
          </div>
        </section>

        {/* Buyer pricing */}
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <p className="section-label">For buyers</p>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-3)' }}>
              Start free. Act when you're ready.
            </h2>
            <p className="section-sub" style={{ marginBottom: 'var(--space-10)' }}>
              Register your interest in any location at no cost. Unlock paid actions when you want to actively pursue a property or street.
            </p>
            <div className="pricing-grid">
              {BUYER_ACTIONS.map((action) => (
                <div key={action.name} className={`price-card${action.featured ? ' price-card-featured' : ''}`}>
                  {action.featured && <div className="price-card-tag">Most popular</div>}
                  <div className="price-card-name">{action.name}</div>
                  <div className="price-card-amount">
                    {action.price}
                    {action.priceNote && <span> / {action.priceNote}</span>}
                  </div>
                  <p className="price-card-desc">{action.description}</p>
                  <ul className="price-card-items">
                    {action.features.map((f) => (
                      <li key={f} className="price-card-item">
                        <svg className="price-check" viewBox="0 0 20 20" fill="none">
                          <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={action.cta.href} className="btn btn-primary w-full mt-auto" style={{ marginTop: 'auto' }}>
                    {action.cta.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seller pricing */}
        <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
          <div className="container">
            <p className="section-label">For sellers</p>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-3)' }}>
              Know before you commit.
            </h2>
            <p className="section-sub" style={{ marginBottom: 'var(--space-10)' }}>
              Check demand at your address for free. If buyers are waiting, reach them all with a single broadcast.
            </p>
            <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', maxWidth: 680 }}>
              {SELLER_ACTIONS.map((action) => (
                <div key={action.name} className={`price-card${action.featured ? ' price-card-featured' : ''}`}>
                  {action.featured && <div className="price-card-tag">Most popular</div>}
                  <div className="price-card-name">{action.name}</div>
                  <div className="price-card-amount">
                    {action.price}
                    {action.priceNote && <span> / {action.priceNote}</span>}
                  </div>
                  <p className="price-card-desc">{action.description}</p>
                  <ul className="price-card-items">
                    {action.features.map((f) => (
                      <li key={f} className="price-card-item">
                        <svg className="price-check" viewBox="0 0 20 20" fill="none">
                          <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={action.cta.href} className="btn btn-primary w-full" style={{ marginTop: 'auto' }}>
                    {action.cta.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison note */}
        <section className="section section-teal">
          <div className="container-narrow">
            <p className="section-label">Worth knowing</p>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>
              How this compares
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {[
                {
                  label: 'Estate agent commission',
                  value: '1–3% of sale price',
                  note: 'Typically £3,000–£9,000 on an average UK home — payable whether or not you chose the buyer.',
                },
                {
                  label: 'Rightmove listing',
                  value: 'Agent fee included',
                  note: 'You can\'t list on Rightmove directly. You pay an agent, who pays for the listing as part of their service.',
                },
                {
                  label: 'Intentory owner approach',
                  value: '£29',
                  note: 'A single, personally addressed letter to the owner of a specific property. No commission. No agent.',
                },
                {
                  label: 'Intentory street outreach',
                  value: '£99',
                  note: 'Every owner on a street contacted. Equivalent reach to dozens of individual approaches, for the cost of a family dinner.',
                },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ minWidth: 200, flexShrink: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--navy)', marginBottom: 2 }}>{row.label}</div>
                    <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--teal-dark)' }}>{row.value}</div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, paddingTop: 2 }}>{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
          <div className="container-narrow">
            <p className="section-label">Pricing questions</p>
            <div className="faq-list">
              {FAQ_ITEMS.map(({ q, a }) => (
                <details key={q} className="faq-item">
                  <summary>
                    {q}
                    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="faq-body">{a}</p>
                </details>
              ))}
            </div>
            <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--slate)' }}>
              More questions?{' '}
              <Link href="/faq" style={{ color: 'var(--teal)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Read the full FAQ →
              </Link>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="section section-dark">
          <div className="container-narrow" style={{ textAlign: 'center' }}>
            <h2 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              Start for free. No card required.
            </h2>
            <p className="section-sub section-sub-light" style={{ margin: '0 auto var(--space-8)' }}>
              Register your buying interest in minutes. You only pay when you choose to take action.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Register interest free
              </Link>
              <Link href="/sellers/check" className="btn btn-outline btn-lg">
                Check demand at my address
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
