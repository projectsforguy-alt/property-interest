import Link from 'next/link';

export const metadata = { title: 'For homeowners | Intentory' };

export default function SellersPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            For homeowners
          </div>
          <h1 className="hero-headline">
            See if buyers are already<br />
            <em>waiting for your home.</em>
          </h1>
          <p className="hero-sub">
            Before you call an agent, check whether serious buyers have already registered interest in your property, your street, or your area. No obligation. No public listing.
          </p>
          <div className="hero-actions">
            <Link href="/sellers/check" className="btn btn-primary btn-lg">
              Check demand at my address
            </Link>
            <Link href="/how-it-works" className="btn btn-outline btn-lg">
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-label">What you can do</div>
          <h2 className="section-headline">A private route to market,<br />on your terms.</h2>
          <div className="steps" style={{ marginTop: 'var(--space-10)' }}>
            {[
              { n: '01', title: 'Check demand for free', body: 'Enter your address to see whether buyers have already registered interest in your property, your street, or your postcode area. No account needed.' },
              { n: '02', title: 'Register as privately available', body: 'If demand exists and you\'re interested in exploring a private sale, create a free account and register your property as available to matched buyers.' },
              { n: '03', title: 'Reach matched buyers', body: 'Pay £49 to send your property privately to every buyer who has registered matching interest. They\'re notified in their account and can open a conversation with you.' },
              { n: '04', title: 'Stay in control', body: 'Nothing is public. You decide whether to respond to buyer messages, arrange a viewing, or proceed — all before any agent or public listing is involved.' },
            ].map(s => (
              <div key={s.n} className="step">
                <div className="step-number">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-label">Why Intentory</div>
          <h2 className="section-headline">You might not need to list at all.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-10)' }}>
            {[
              { title: 'No agent fees', desc: 'A private introduction via Intentory costs £49. A traditional agent typically charges 1–2% of the sale price.' },
              { title: 'Serious buyers only', desc: 'Every buyer in our database has declared their budget, buying position, and timeline. No tyre-kickers.' },
              { title: 'No public exposure', desc: 'Your property never appears on Rightmove, Zoopla, or any public portal. The process is entirely private.' },
              { title: 'No obligation', desc: 'Checking demand is free and creates no commitment. You decide whether to proceed at every step.' },
            ].map(item => (
              <div key={item.title} className="card">
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>{item.title}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-teal">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
          <div>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-2)' }}>Check demand at your address</h2>
            <p style={{ color: 'var(--slate)', fontSize: 'var(--text-base)' }}>Free, instant, and no account required.</p>
          </div>
          <Link href="/sellers/check" className="btn btn-primary btn-lg">Check now — free</Link>
        </div>
      </section>
    </>
  );
}
