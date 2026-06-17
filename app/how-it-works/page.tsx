import Link from 'next/link';

export const metadata = { title: 'How Intentory works | Intentory' };

const BUYER_STEPS = [
  { n: '01', title: 'Register your interest', body: 'Choose the type of interest you want to register — a specific property, a street, a village, an area, or a plot of land. Add your postcode or address and tell us what you\'re looking for.' },
  { n: '02', title: 'Complete your buyer profile', body: 'Add your budget, buying position (cash buyer, mortgage approved, in a chain etc.), preferred property type, and timeline. This profile is private and only shared when you choose to act.' },
  { n: '03', title: 'Your intent is stored privately', body: 'Your interest is matched against that specific location in our database. You\'ll receive a confirmation email and can add more locations, update your profile, or manage alerts from your account.' },
  { n: '04', title: 'Get alerted when something changes', body: 'If a seller registers as available at a location you\'re interested in, or if we find a property has come to market, you\'ll be notified. You decide whether to act.' },
  { n: '05', title: 'Choose how to proceed', body: 'Continue for free, or upgrade to a paid action — request a direct owner approach, initiate a street campaign, or open a private conversation with a matched seller.' },
];

const SELLER_STEPS = [
  { n: '01', title: 'Enter your address', body: 'Visit our homeowner demand check and enter your full address or postcode. No account required to check demand.' },
  { n: '02', title: 'See what we\'re showing buyers', body: 'We\'ll show you whether buyers have registered interest in your property, your street, or your area. You won\'t see buyer names or contact details at this stage.' },
  { n: '03', title: 'Register as privately available', body: 'If you\'re interested in exploring a private sale, register your property as available. You create a seller account and add your property details.' },
  { n: '04', title: 'We match you to interested buyers', body: 'Once you\'re registered, we identify buyers whose registered interest overlaps with your property — by address, street, postcode, or area.' },
  { n: '05', title: 'Initiate a private introduction', body: 'Pay to send your property to matched buyers privately. They receive a notification, can view the property in their account, and can open a conversation — all before any public listing.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="section section-dark">
        <div className="container">
          <div className="section-label section-label-dark">How it works</div>
          <h1 className="section-headline" style={{ color: 'var(--white)', maxWidth: 640 }}>
            A private market that runs quietly beneath the public one.
          </h1>
          <p className="section-sub section-sub-light">
            Most serious buyers and motivated sellers never find each other because one hasn&apos;t listed yet and the other hasn&apos;t asked. Intentory bridges that gap.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-label">For buyers</div>
          <h2 className="section-headline">Register intent. Get alerted. Move first.</h2>
          <div className="steps" style={{ marginTop: 'var(--space-10)' }}>
            {BUYER_STEPS.map(s => (
              <div key={s.n} className="step">
                <div className="step-number">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-10)' }}>
            <Link href="/register" className="btn btn-primary btn-lg">Register free</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-label">For homeowners</div>
          <h2 className="section-headline">Check demand. Sell privately. Stay in control.</h2>
          <div className="steps" style={{ marginTop: 'var(--space-10)' }}>
            {SELLER_STEPS.map(s => (
              <div key={s.n} className="step">
                <div className="step-number">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-10)' }}>
            <Link href="/sellers" className="btn btn-outline-dark btn-lg">Check demand at my address</Link>
          </div>
        </div>
      </section>

      <section className="section section-teal">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
          <div>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-2)' }}>Ready to register?</h2>
            <p style={{ color: 'var(--slate)', fontSize: 'var(--text-base)' }}>It takes two minutes and it&apos;s free.</p>
          </div>
          <Link href="/register" className="btn btn-primary btn-lg">Register buying interest</Link>
        </div>
      </section>
    </>
  );
}
