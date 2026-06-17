import Link from 'next/link';

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
      <HeroSection />
      <HowItWorksSection />
      <TwoSidedSection />
      <PaidActionsSection />
      <CtaSection />
    </>
  );
}

function HeroSection() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Private property demand
        </div>
        <h1 className="hero-headline">
          Register where you want to buy —<br />
          <em>before it comes to market.</em>
        </h1>
        <p className="hero-sub">
          Intentory builds a private layer of buyer demand by location. Homeowners can check whether serious buyers are already waiting before they decide to sell.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="btn btn-primary btn-lg">
            Register buying interest
          </Link>
          <Link href="/sellers" className="btn btn-outline btn-lg">
            I own a property
          </Link>
        </div>

        <div className="demand-ticker">
          <div className="demand-ticker-label">Live buyer demand</div>
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
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      n: '01',
      title: 'Register your interest',
      body: 'Tell us where you want to buy — a specific property, a street, a village, or an area. Add your budget and buying position. It\'s free.',
    },
    {
      n: '02',
      title: 'Your intent is recorded',
      body: 'Your interest is stored privately against that location. You\'ll receive a confirmation and can manage your interests from your account.',
    },
    {
      n: '03',
      title: 'Owners can check demand',
      body: 'Homeowners can enter their address to see whether buyers are already interested in their property or area before deciding to sell.',
    },
    {
      n: '04',
      title: 'Private introductions happen',
      body: 'When a seller registers as available, we match them to relevant buyers. Introductions happen privately — no public listing required.',
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-label">How it works</div>
        <h2 className="section-headline">A private market,<br />before the public one.</h2>
        <p className="section-sub">
          Most properties are sold before serious buyers even know they were available. Intentory changes that.
        </p>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.n} className="step">
              <div className="step-number">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <p className="step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TwoSidedSection() {
  return (
    <section className="section section-sm" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div className="split">
          <div className="split-card split-card-buyer">
            <div className="split-card-eyebrow">For buyers</div>
            <h3 className="split-card-headline">Register where<br />you want to buy.</h3>
            <p className="split-card-sub">
              Free to register. Tell us the property, street, or area. We capture your budget, position, and timeline — and alert you the moment a matching opportunity appears.
            </p>
            <ul className="split-card-list">
              {[
                'Specific properties, streets, areas or land',
                'Private alerts when sellers register as available',
                'Manage multiple interests from one account',
                'Upgrade to make a direct owner approach',
              ].map((item) => (
                <li key={item} className="split-card-item">
                  <svg className="split-card-icon" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              Register free
            </Link>
          </div>

          <div className="split-card split-card-seller">
            <div className="split-card-eyebrow">For homeowners</div>
            <h3 className="split-card-headline">See if buyers are<br />already waiting.</h3>
            <p className="split-card-sub">
              Before you list, check whether serious buyers have already registered interest in your property, your street, or your area. No obligation, no agent required.
            </p>
            <ul className="split-card-list">
              {[
                'Check demand at your address in seconds',
                'Register as privately available to matched buyers',
                'Control who knows — no public listing',
                'Pay only if you want to reach matched buyers',
              ].map((item) => (
                <li key={item} className="split-card-item">
                  <svg className="split-card-icon" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/sellers" className="btn btn-outline-dark" style={{ alignSelf: 'flex-start' }}>
              Check demand at my address
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaidActionsSection() {
  const actions = [
    {
      label: 'Private owner approach',
      price: '£29',
      desc: 'Already registered interest in a specific property? Upgrade to have us contact the owner directly on your behalf with a private, professional letter and QR-coded response link.',
    },
    {
      label: 'Street or area outreach',
      price: 'From £99',
      desc: 'Want to unlock a whole street or area? We contact every owner in your target location and invite them to check whether buyers are waiting for their home specifically.',
    },
    {
      label: 'Seller broadcast',
      price: '£49',
      desc: 'Ready to sell privately? Pay to have your property sent directly to every buyer who has registered matching interest — before it appears anywhere publicly.',
    },
  ];

  return (
    <section className="section section-dark">
      <div className="container">
        <div className="section-label section-label-dark">Paid actions</div>
        <h2 className="section-headline" style={{ color: 'var(--white)' }}>
          When you&apos;re ready to move.
        </h2>
        <p className="section-sub section-sub-light">
          Registration is always free. These optional actions let you take a private approach when demand or opportunity exists.
        </p>
        <div className="pricing-grid">
          {actions.map((a) => (
            <div key={a.label} className="price-card">
              <div className="price-card-name">{a.label}</div>
              <div className="price-card-amount">{a.price}</div>
              <p className="price-card-desc">{a.desc}</p>
              <Link href="/register" className="btn btn-outline-dark w-full" style={{ marginTop: 'auto' }}>
                Register first — free
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="section section-teal">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="section-label">Get started</div>
        <h2 className="section-headline">Your next home might<br />not be listed yet.</h2>
        <p className="section-sub" style={{ margin: '0 auto var(--space-8)' }}>
          Register your buying intent today. It takes two minutes and it&apos;s free. We&apos;ll alert you the moment a matching opportunity appears.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary btn-lg">Register interest — free</Link>
          <Link href="/how-it-works" className="btn btn-outline-dark btn-lg">Learn more</Link>
        </div>
      </div>
    </section>
  );
}
