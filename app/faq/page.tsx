export const metadata = { title: 'FAQ | Intentory' };

const FAQS = [
  {
    section: 'For buyers',
    items: [
      { q: 'Is registering interest free?', a: 'Yes. Registering buying interest — whether for a specific property, street, area, or plot of land — is always free. You only pay if you choose to take a paid action, such as requesting a direct owner approach or a street outreach campaign.' },
      { q: 'What types of interest can I register?', a: 'You can register interest in a specific property by address, a named street, a village or area, a postcode, or a plot of land. You can hold multiple interests across different locations from the same account.' },
      { q: 'Will the homeowner know I\'m interested?', a: 'Not unless you choose to act. Registering interest is private. If you upgrade to a paid owner approach, we contact the homeowner on your behalf — but your personal details are not shared in that letter. The owner can choose to respond through our platform.' },
      { q: 'What happens when a seller registers as available?', a: 'If a homeowner registers their property as available and you have a matching interest registered (by property, street, postcode, or area), you\'ll receive an alert. From there, you can choose to open a private conversation through your account.' },
      { q: 'Can I register interest in a property that is already listed publicly?', a: 'Yes — you can register interest in any property. If it\'s already on the market, your interest is noted and you\'ll receive a notification if anything changes. It can also be useful if a property is listed but you want to make a private approach ahead of other buyers.' },
    ],
  },
  {
    section: 'For homeowners',
    items: [
      { q: 'Do I need an account to check demand?', a: 'No. You can enter your address on the demand check page and see whether buyer interest exists at your property, street, or area without creating an account. You\'ll need an account if you want to register as available or receive alerts.' },
      { q: 'What does "buyer demand" mean exactly?', a: 'It means that one or more buyers have registered a formal buying interest in your property, your street, your area, or your postcode using Intentory. It is not a guarantee of a sale or an offer — it is a record of declared intent from a real buyer.' },
      { q: 'Is registering my property as available a public listing?', a: 'No. Registering as available is entirely private. Only buyers who have already registered matching interest in your location will be notified. Your address is not published anywhere publicly.' },
      { q: 'How much does it cost to reach matched buyers?', a: 'Checking demand and registering as available are free. To send a broadcast to all matched buyers — notifying them that your property is available — there is a one-off fee of £49.' },
    ],
  },
  {
    section: 'Privacy & data',
    items: [
      { q: 'Who can see my registered interest?', a: 'Your interest is stored privately in our system. Your name and contact details are never shared with homeowners unless you explicitly choose to proceed with a paid introduction and both parties consent.' },
      { q: 'How long is my interest stored?', a: 'Your interest remains active in your account until you remove it. You can update, pause, or delete any of your registered interests at any time.' },
      { q: 'Are buyer details shared with estate agents or third parties?', a: 'No. Intentory does not share buyer or seller data with estate agents, portals, or any third party. We are not an estate agency and do not participate in open market sales.' },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="section section-dark">
        <div className="container">
          <div className="section-label section-label-dark">FAQ</div>
          <h1 className="section-headline" style={{ color: 'var(--white)' }}>Frequently asked questions</h1>
          <p className="section-sub section-sub-light">Everything you need to know about how Intentory works.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          {FAQS.map(group => (
            <div key={group.section} style={{ marginBottom: 'var(--space-12)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--space-4)' }}>{group.section}</div>
              <div className="faq-list">
                {group.items.map(f => (
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
          ))}
        </div>
      </section>
    </>
  );
}
