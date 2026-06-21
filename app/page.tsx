import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The home you want probably isn\'t listed',
  description:
    'Intentory lets buyers register private interest in any home — listed or not. Sellers discover real buyer demand at their address before going to market. Free to start.',
  alternates: {
    canonical: 'https://property-interest-sepia.vercel.app',
  },
  openGraph: {
    title: 'The home you want probably isn\'t listed | Intentory',
    description:
      'Register private interest in any home. Sellers discover real buyer demand before going to market. Free to start.',
    url: 'https://property-interest-sepia.vercel.app',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Can I buy a house that isn\'t for sale?',
    answer:
      'Yes. Many homeowners would consider selling if approached in the right way — they simply haven\'t listed because nobody has asked. Intentory lets you register genuine interest in a specific address, street, or area, and we can contact the owner on your behalf. This is known as an off-market approach.',
  },
  {
    question: 'What is off-market property?',
    answer:
      'Off-market property refers to homes that are sold or agreed privately, without being listed on Rightmove, Zoopla, or through an estate agent. These transactions are more common than most people realise — particularly in sought-after streets and villages where owners prefer discretion.',
  },
  {
    question: 'How much does it cost to register interest?',
    answer:
      'Registering buyer interest is completely free. There\'s no subscription. You only pay if you choose to take an active step — such as requesting an owner approach (£29), street outreach (£99), or area outreach (£199).',
  },
  {
    question: 'How do sellers use Intentory?',
    answer:
      'Sellers enter their postcode to see whether any buyers have already registered interest at their address, street, or area. If demand exists, they can register as privately available and broadcast to matched buyers for £49 — without any public listing.',
  },
  {
    question: 'Is my registration kept private?',
    answer:
      'Yes. Individual buyer registrations are never publicly visible. Sellers only see that demand exists at their address — not who the buyers are — until both parties agree to connect.',
  },
  {
    question: 'What areas does Intentory cover?',
    answer:
      'Intentory covers all of England and Wales. Buyers can register interest at any valid UK postcode, and sellers at any residential address.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

const TICKER_ITEMS = [
  { location: 'Prestbury Road, SK10', count: 4 },
  { location: 'Victoria Park, M14', count: 7 },
  { location: 'Church Lane, GU1', count: 2 },
  { location: 'The Ridgeway, NW7', count: 5 },
  { location: 'Fulwood Park, L17', count: 3 },
  { location: 'Abbots Way, AB15', count: 6 },
  { location: 'Elm Grove, BN2', count: 2 },
  { location: 'Cavendish Road, SW12', count: 9 },
  { location: 'Hartley Road, TN35', count: 1 },
  { location: 'Beech Avenue, NG9', count: 4 },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <ProblemSection />
      <BuyerBenefitsSection />
      <SellerBenefitsSection />
      <HowItWorksSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}

function HeroSection() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section style={{ background: 'var(--navy)', color: 'var(--white)', overflow: 'hidden' }}>
      {/* Desktop: side by side. Mobile: stacked via CSS class */}
      <div className="hero-layout">
        {/* Left — text */}
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Private property demand platform
          </div>
          <h1 className="hero-headline">
            The home you want probably <em>isn&apos;t listed.</em>
          </h1>
          <p className="hero-sub">
            Intentory lets buyers make private offers on any home — listed or not. And lets homeowners discover whether serious buyers are already waiting, before they call an agent.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary btn-lg">
              Go after the home you want
            </Link>
            <Link href="/sellers" className="btn btn-outline btn-lg">
              I own a property
            </Link>
          </div>
          <div className="demand-ticker" style={{ marginTop: 'var(--space-10)' }}>
            <div className="demand-ticker-label">Buyer demand registered today</div>
            <div className="demand-ticker-track" aria-hidden="true">
              <div className="demand-ticker-inner">
                {doubled.map((item, i) => (
                  <span key={i} className="demand-chip">
                    <span className="demand-chip-count">{item.count}</span>
                    {item.count === 1 ? 'buyer' : 'buyers'} · {item.location}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — image */}
        <div className="hero-img-wrap">
          <img
            src="/images/hero.png"
            alt="A desirable home on a quiet residential street"
            className="hero-img"
          />
          <div className="hero-img-fade" />
        </div>
      </div>
    </section>
  );
}


function ProblemSection() {
  return (
    <section className="section" style={{ background: 'var(--white)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div className="two-col-grid" style={{ alignItems: 'center' }}>
          <div>
            <div className="section-label">The problem</div>
            <h2 className="section-headline">
              Most property transactions are decided before anyone lists.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ paddingLeft: 'var(--space-5)', borderLeft: '3px solid var(--teal)' }}>
              <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)', fontSize: 'var(--text-base)' }}>For buyers</div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65 }}>
                You want a specific road, village, or type of home. But you&apos;re at the mercy of whatever happens to be listed — and when your dream home does appear, so does everyone else. The best properties go before most buyers even knew they existed.
              </p>
            </div>
            <div style={{ paddingLeft: 'var(--space-5)', borderLeft: '3px solid var(--teal)' }}>
              <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)', fontSize: 'var(--text-base)' }}>For sellers</div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65 }}>
                You&apos;re considering selling but don&apos;t know if the demand is there. So you call an agent, agree to a commission, and commit to a process — before you even know whether a buyer is already out there waiting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BuyerBenefitsSection() {
  const benefits = [
    {
      title: 'Go after the home you actually want',
      body: 'Most buyers search what\'s listed. Intentory lets you identify exactly where you want to live — a specific road, a village, a postcode — and make a private approach to owners directly. You\'re not waiting for luck.',
    },
    {
      title: 'Make an offer before it hits the market',
      body: 'Register interest in a specific property and we\'ll contact the owner on your behalf. A motivated seller who hasn\'t yet committed to an agent may prefer a clean, private sale — on your terms and your timescale.',
    },
    {
      title: 'First mover advantage',
      body: 'When a seller registers as available, matched buyers are notified privately before any public listing. You get first sight — ahead of every buyer watching Rightmove.',
    },
    {
      title: 'Your interest works while you wait',
      body: 'Register once. If an owner on your target street decides to sell — now or in six months — you\'ll be the first to know. No refreshing portals. No missing the window.',
    },
  ];

  return (
    <section className="section section-dark">
      <div className="container">
        <div className="two-col-grid" style={{ alignItems: 'center' }}>
          <div>
            <div className="section-label section-label-dark">For buyers</div>
            <h2 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-3)' }}>
              Stop waiting for the right home to appear. Go and find it.
            </h2>
            <p className="section-sub section-sub-light" style={{ marginBottom: 'var(--space-8)' }}>
              Intentory gives serious buyers a private route to the homes they actually want — not just the ones that happen to be listed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginBottom: 'var(--space-10)' }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--teal)', width: 24, flexShrink: 0, paddingTop: 3 }}>0{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--white)', marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{b.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/register" className="btn btn-primary">Register interest free</Link>
          </div>

          {/* Image block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 'var(--space-3)' }}>
            <div style={{ gridColumn: '1 / -1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '16/7' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/block-1.png" alt="A quiet residential street"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/block-2.png" alt="A family on a desirable residential street"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/block-3.png" alt="A homeowner considering their options"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SellerBenefitsSection() {
  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div className="two-col-grid" style={{ alignItems: 'center' }}>
          <div>
            <div className="section-label">For homeowners</div>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-4)' }}>
              Find out if buyers are waiting — before you commit to anything.
            </h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65, marginBottom: 'var(--space-8)' }}>
              Check real buyer demand at your address in seconds. If demand exists, you have options — including selling privately for a fraction of what a traditional agent would charge.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link href="/sellers/check" className="btn btn-primary">Check demand at my address</Link>
              <Link href="/sellers" className="btn btn-outline-dark">Learn more</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              {
                title: 'Know before you commit',
                body: 'See whether serious buyers have already registered interest in your property, street or area — before you sign anything with anyone.',
              },
              {
                title: 'Sell privately, on your terms',
                body: 'If demand exists, register as available and we match you to interested buyers. No public listing, no open days, no unqualified viewings.',
              },
              {
                title: 'Save significantly on fees',
                body: 'Estate agent commission typically runs to thousands. A private sale through Intentory costs a fraction of that — particularly when the buyer is already out there waiting.',
              },
              {
                title: 'No obligation at any stage',
                body: 'Checking demand is free and creates zero commitment. You decide at every step whether to proceed.',
              },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--teal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="var(--teal-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.6 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="section section-teal">
      <div className="container">
        <div className="section-label">Simple by design</div>
        <h2 className="section-headline" style={{ marginBottom: 'var(--space-12)' }}>How Intentory works</h2>
        <div className="two-col-grid">
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--teal-dark)', marginBottom: 'var(--space-5)' }}>Buyers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {[
                { n: '01', t: 'Register where you want to buy', b: 'A specific address, a street, a village, or an area. Free to register.' },
                { n: '02', t: 'We match you to available sellers', b: 'When a seller registers in your target location, you\'re notified immediately — privately.' },
                { n: '03', t: 'Make your move', b: 'Open a private conversation, make an offer, or upgrade to a direct owner approach on any unlisted property.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--teal-dark)', width: 24, flexShrink: 0, paddingTop: 2 }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>{s.t}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.6 }}>{s.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--teal-dark)', marginBottom: 'var(--space-5)' }}>Sellers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {[
                { n: '01', t: 'Check demand at your address', b: 'Enter your postcode. See whether buyers have already registered interest in your property or area. Free and instant.' },
                { n: '02', t: 'Register as privately available', b: 'If you\'re open to selling, register your property. We match it to relevant buyers — no public listing involved.' },
                { n: '03', t: 'Connect and proceed on your terms', b: 'Receive buyer messages, arrange viewings, and decide whether to proceed — all privately, all without an agent if you choose.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--teal-dark)', width: 24, flexShrink: 0, paddingTop: 2 }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>{s.t}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.6 }}>{s.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
      <div className="container-narrow">
        <div className="section-label">FAQ</div>
        <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>
          Common questions
        </h2>
        <div className="faq-list">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <details key={question} className="faq-item">
              <summary>
                {question}
                <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="faq-body">{answer}</p>
            </details>
          ))}
        </div>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <Link href="/how-it-works" style={{ fontSize: 'var(--text-sm)', color: 'var(--teal)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Read the full guide to how Intentory works →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="section section-dark">
      <div className="container">
        <div className="two-col-grid" style={{ gap: 'var(--space-4)' }}>
          <div className="split-card split-card-buyer" style={{ background: 'var(--navy-soft)' }}>
            <div className="split-card-eyebrow">For buyers</div>
            <h3 className="split-card-headline">Go after the home you want.</h3>
            <p className="split-card-sub">
              Register your interest in any property, street or area. Make private approaches. Get first sight of seller availability. Free to start.
            </p>
            <Link href="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              Register free
            </Link>
          </div>
          <div className="split-card split-card-seller">
            <div className="split-card-eyebrow">For homeowners</div>
            <h3 className="split-card-headline">See if buyers are already waiting.</h3>
            <p className="split-card-sub">
              Check demand at your address in seconds. Register as privately available. Sell on your terms — without committing to an agent first.
            </p>
            <Link href="/sellers/check" className="btn btn-outline-dark" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              Check demand — free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
