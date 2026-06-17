import Link from 'next/link';

export const metadata = { title: 'Pricing | Intentory' };

const PAID_ACTIONS = [
  {
    name: 'Private owner approach',
    amount: '£29',
    who: 'Buyer',
    desc: 'Have us contact a specific homeowner on your behalf with a professional letter and a private QR-coded response link.',
    items: [
      'Professional letter drafted and sent to the owner',
      'Private QR code and response link included',
      'Owner can respond, decline, or request more info',
      'You are notified of any response',
      'One property per request',
    ],
  },
  {
    name: 'Street outreach',
    amount: '£99',
    who: 'Buyer',
    desc: 'We contact every owner on a target street and invite them to check whether buyers are waiting for their home.',
    items: [
      'Up to 15 properties on a single street',
      'Professional letter to each owner',
      'Each owner can check demand and register as available',
      'You are matched and alerted to any interested sellers',
    ],
  },
  {
    name: 'Area outreach',
    amount: '£199',
    who: 'Buyer',
    desc: 'Wider campaign across a postcode or area — up to 30 properties approached on your behalf.',
    items: [
      'Up to 30 properties in a defined area',
      'Professional letter to each owner',
      'Full campaign report on responses',
      'Matched to any sellers who register as available',
    ],
    featured: true,
  },
  {
    name: 'Seller broadcast',
    amount: '£49',
    who: 'Seller',
    desc: 'Send your property to every buyer who has registered matching interest — privately, before any public listing.',
    items: [
      'Matched to buyers by property, street, postcode and area',
      'Private notification sent to all matched buyers',
      'Buyers can open a conversation from their account',
      'No public listing required',
    ],
  },
];

const FAQS = [
  { q: 'Is registration really free?', a: 'Yes — registering buying interest is always free. You only pay if you choose to take a paid action, such as requesting a direct owner approach or broadcasting your property to matched buyers.' },
  { q: 'What if no sellers respond to an owner approach?', a: 'We cannot guarantee a response from any homeowner. If we are unable to deliver a letter (e.g. undeliverable address), we will notify you. We do not offer refunds where a letter is delivered but the owner does not respond.' },
  { q: 'Can I register as a seller without paying?', a: 'Yes. You can check demand at your address and register your property as available for free. You only pay if you want to send a broadcast to matched buyers.' },
  { q: 'Are my details shared with the homeowner in a buyer approach?', a: 'No. The letter we send does not include your name or contact details. The owner receives a private link to respond — we manage the introduction.' },
  { q: 'What happens if both parties want to proceed?', a: 'Once both a buyer and seller have expressed mutual interest, we open a private messaging thread in their accounts. From there, you can exchange details, arrange viewings, or involve solicitors — Intentory facilitates the introduction, not the sale itself.' },
];

export default function PricingPage() {
  return (
    <>
      <section className="section section-dark">
        <div className="container">
          <div className="section-label section-label-dark">Pricing</div>
          <h1 className="section-headline" style={{ color: 'var(--white)' }}>
            Free to register.<br />Pay only when you act.
          </h1>
          <p className="section-sub section-sub-light">
            Building a demand profile costs nothing. Paid actions are available when you&apos;re ready to move — whether you&apos;re a buyer making a private approach or a seller reaching matched buyers.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-label">Free tier</div>
          <h2 className="section-headline" style={{ marginBottom: 'var(--space-6)' }}>What&apos;s always free</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-16)' }}>
            {[
              { title: 'Buyer registration', desc: 'Register interest in specific properties, streets, areas, or land. Unlimited registrations.' },
              { title: 'Buyer profile', desc: 'Your budget, buying position, timeline, and preferences — stored privately against your interests.' },
              { title: 'Demand check', desc: 'Homeowners can check buyer demand at their address at any time, with no account required.' },
              { title: 'Seller registration', desc: 'Register your property as privately available to matched buyers. Free to set up.' },
              { title: 'Match alerts', desc: 'Be notified when a seller registers as available at a location you\'ve saved, or when a buyer matches your property.' },
              { title: 'Account dashboard', desc: 'Manage all your interests, properties, and conversations from one place.' },
            ].map(item => (
              <div key={item.title} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }}>
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-label">Paid actions</div>
          <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>When you&apos;re ready to move</h2>
          <div className="pricing-grid">
            {PAID_ACTIONS.map(a => (
              <div key={a.name} className={`price-card${a.featured ? ' price-card-featured' : ''}`}>
                {a.featured && <span className="price-card-tag">Most popular</span>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="price-card-name">{a.name}</div>
                  <span className="badge badge-slate">{a.who}</span>
                </div>
                <div className="price-card-amount">{a.amount}</div>
                <p className="price-card-desc">{a.desc}</p>
                <ul className="price-card-items">
                  {a.items.map(item => (
                    <li key={item} className="price-card-item">
                      <svg className="price-check" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="btn btn-outline-dark w-full" style={{ marginTop: 'var(--space-4)' }}>
                  Register first — free
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div className="container-narrow">
          <div className="section-label">FAQ</div>
          <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>Pricing questions</h2>
          <div className="faq-list">
            {FAQS.map(f => (
              <details key={f.q} className="faq-item">
                <summary>
                  {f.q}
                  <svg className="faq-chevron" viewBox="0 0 20 20" fill="none">
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="faq-body">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
