import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to sell your house without an estate agent',
  description:
    'A practical guide to selling property privately in the UK — the options available, the real costs and risks, and how private demand platforms like EarlyEggs change the picture.',
  alternates: {
    canonical: 'https://www.earlyeggs.com/sell-without-an-estate-agent',
  },
  openGraph: {
    title: 'How to sell your house without an estate agent | EarlyEggs',
    description:
      'The options, costs, and risks of selling property privately in the UK — and how to find buyers without a public listing.',
    url: 'https://www.earlyeggs.com/sell-without-an-estate-agent',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to sell your house without an estate agent in the UK',
  description:
    'A practical guide to selling property privately in the UK — the options available, the real costs, and how to find buyers without a public listing.',
  author: {
    '@type': 'Organization',
    name: 'EarlyEggs',
    url: 'https://www.earlyeggs.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'EarlyEggs',
    url: 'https://www.earlyeggs.com',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.earlyeggs.com/sell-without-an-estate-agent',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I sell my house without an estate agent in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. There is no legal requirement to use an estate agent to sell a residential property in England or Wales. You can sell privately, through an online agent, or through a private demand platform. You will still need a solicitor for conveyancing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to sell a house without an estate agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main saving is the agent\'s commission, which typically runs to 1–3% of the sale price — often £3,000 to £9,000 or more on an average UK home. You will still need to pay for conveyancing (typically £1,000–£2,000), an Energy Performance Certificate if you don\'t have one (around £60–£120), and any marketing costs if you choose to advertise.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the risks of selling without an estate agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main risks are: reaching fewer buyers (particularly if you don\'t list on Rightmove), setting the wrong asking price without professional guidance, and managing the sales process yourself — including viewings, offers, and chain management. These risks are reduced significantly when selling to a buyer who already wants your property specifically.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I list on Rightmove without an estate agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not directly. Rightmove only accepts listings from registered estate agents and online listing services. To list on Rightmove privately you would need to use an online agent or listing service that provides portal access for a fixed fee.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does EarlyEggs help sellers avoid estate agent fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EarlyEggs lets sellers check whether buyers have already registered interest at their address before committing to an agent. If matched buyers exist, sellers can broadcast their availability to those buyers for £49 — making a direct connection without any commission or public listing.',
      },
    },
  ],
};

const OPTIONS = [
  {
    title: 'Sell privately to a known buyer',
    best: 'Best when you already have a buyer in mind — a neighbour, a family member, or someone who has approached you.',
    pros: ['No agent fees', 'Fast — no marketing period needed', 'Full control over the process'],
    cons: ['No competitive tension to drive up the price', 'You need to have found the buyer already'],
  },
  {
    title: 'Use an online listing service',
    best: 'Best when you want Rightmove exposure but don\'t want to pay percentage commission.',
    pros: ['Portal access (Rightmove, Zoopla)', 'Fixed fee rather than commission', 'You manage viewings yourself'],
    cons: ['Still requires a public listing and viewings', 'Less support than a full-service agent', 'You manage all negotiations directly'],
  },
  {
    title: 'Use a private demand platform',
    best: 'Best when you want to find out whether buyers are already out there — before committing to any marketing.',
    pros: ['Check demand for free before doing anything', 'No public listing required', 'Reach buyers already registered at your address', 'No commission on the sale'],
    cons: ['Depends on whether buyers are registered in your area', 'Less reach than a full open-market sale'],
  },
  {
    title: 'Use a traditional estate agent',
    best: 'Best when maximum exposure and professional guidance are the priority, and you\'re willing to pay for it.',
    pros: ['Full marketing including Rightmove listing', 'Professional valuations and negotiation support', 'Wider buyer pool'],
    cons: ['Commission of 1–3% of sale price', 'Less control over the process', 'Open viewings and public exposure'],
  },
];

const FAQ_ITEMS = [
  {
    q: 'Can I sell my house without an estate agent in the UK?',
    a: 'Yes. There is no legal requirement to use an estate agent to sell a residential property in England or Wales. You can sell privately, through an online agent, or through a private demand platform. You will still need a solicitor for conveyancing.',
  },
  {
    q: 'How much does it cost to sell a house without an estate agent?',
    a: 'The main saving is the agent\'s commission, which typically runs to 1–3% of the sale price — often £3,000 to £9,000 or more on an average UK home. You\'ll still need conveyancing (typically £1,000–£2,000), an EPC if you don\'t have one, and any marketing costs.',
  },
  {
    q: 'What are the risks of selling without an estate agent?',
    a: 'The main risks are reaching fewer buyers, setting the wrong asking price, and managing the process yourself. These risks are reduced significantly when selling to a buyer who already wants your specific property — as is the case with a private demand match.',
  },
  {
    q: 'Can I list on Rightmove without an estate agent?',
    a: 'Not directly. Rightmove only accepts listings from registered agents and listing services. To appear on Rightmove you\'d need to use an online agent that provides portal access for a fixed fee.',
  },
  {
    q: 'Do I still need a solicitor if I sell privately?',
    a: 'Yes. Conveyancing — the legal transfer of ownership — requires a solicitor or licensed conveyancer regardless of how you sell. This is true for all residential property transactions in England and Wales.',
  },
  {
    q: 'How does EarlyEggs help sellers avoid estate agent fees?',
    a: 'EarlyEggs lets sellers check whether buyers have already registered interest at their address before committing to anything. If matched buyers exist, sellers can broadcast their availability to those buyers for £49 — making a direct connection without any commission or public listing.',
  },
];

export default function SellWithoutAnEstateAgentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="site-main">

        {/* Hero */}
        <section className="section section-dark" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-16)' }}>
          <div className="container-narrow">
            <p className="section-label">Seller guide</p>
            <h1 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              How to sell your house without an estate agent
            </h1>
            <p className="section-sub section-sub-light" style={{ marginBottom: 'var(--space-8)' }}>
              A straightforward guide to the options available, what they actually cost, and how to decide which route suits your situation.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link href="/sellers/check" className="btn btn-primary btn-lg">
                Check demand at my address
              </Link>
              <Link href="/how-it-works" className="btn btn-outline btn-lg">
                How EarlyEggs works
              </Link>
            </div>
          </div>
        </section>

        {/* Intro prose */}
        <section className="section" style={{ background: 'var(--white)' }}>
          <div className="container-narrow">
            <div className="prose" style={{ maxWidth: '100%' }}>
              <h2>Is selling without an estate agent possible?</h2>
              <p>
                Yes — and it is more common than many sellers realise. There is no legal requirement to use an estate agent to sell a residential property in England or Wales. Thousands of UK properties change hands privately every year, without a portal listing, without open days, and without paying a percentage commission.
              </p>
              <p>
                That said, going without an agent is not the right decision for every seller. The case for doing it depends heavily on whether you already have access to motivated buyers, and how much you value privacy, speed, and cost savings relative to achieving the maximum possible sale price through competitive open-market exposure.
              </p>
              <p>
                This guide covers the main routes available, what each one costs, and the circumstances in which each makes sense.
              </p>

              <h2>What you save — and what you still pay</h2>
              <p>
                The primary saving when selling without an agent is the commission. Traditional high-street agents in the UK typically charge between 1% and 3% of the sale price, inclusive of VAT. On a £400,000 property, that&apos;s £4,000 to £12,000.
              </p>
              <p>
                Regardless of how you sell, you will still need to budget for:
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', margin: 'var(--space-6) 0 var(--space-8)' }}>
              {[
                { item: 'Solicitor / conveyancer', cost: '£1,000 – £2,500', note: 'Required for all residential sales in England and Wales.' },
                { item: 'Energy Performance Certificate (EPC)', cost: '£60 – £120', note: 'Legally required before marketing. Valid for 10 years.' },
                { item: 'Land Registry transfer fee', cost: '£20 – £910', note: 'Scaled to the sale price. Paid at completion.' },
                { item: 'Removal costs', cost: 'Variable', note: 'Not agent-related, but a real cost of moving.' },
              ].map((row) => (
                <div key={row.item} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-4)', alignItems: 'start', padding: 'var(--space-4)', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--forest)', marginBottom: 2 }}>{row.item}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>{row.note}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gold-dark)', whiteSpace: 'nowrap' }}>{row.cost}</div>
                </div>
              ))}
            </div>

            <div className="prose" style={{ maxWidth: '100%' }}>
              <h2>Your options compared</h2>
              <p>
                There are four main routes for selling a property in the UK. The right one depends on your priorities — speed, price, privacy, or simplicity.
              </p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', margin: 'var(--space-8) 0' }}>
              {OPTIONS.map((option, i) => (
                <div key={option.title} style={{ background: i === 2 ? 'var(--gold-soft)' : 'var(--surface)', border: `1.5px solid ${i === 2 ? 'var(--gold)' : 'var(--line)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
                  {i === 2 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--gold)', color: 'var(--forest)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
                      How EarlyEggs works
                    </div>
                  )}
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--forest)', marginBottom: 'var(--space-2)' }}>{option.title}</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>{option.best}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold-dark)', marginBottom: 'var(--space-2)' }}>Advantages</div>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {option.pros.map((p) => (
                          <li key={p} style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.5 }}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                              <path d="M4 10l4 4 8-8" stroke="var(--gold-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate)', marginBottom: 'var(--space-2)' }}>Considerations</div>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {option.cons.map((c) => (
                          <li key={c} style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.5 }}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                              <path d="M6 6l8 8M14 6l-8 8" stroke="var(--mist)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="prose" style={{ maxWidth: '100%' }}>
              <h2>When selling without an agent makes most sense</h2>
              <p>
                The case for selling privately is strongest when one or more of the following is true:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>You know there is demand for your property — a neighbour has expressed interest, or you have checked a platform like EarlyEggs and found registered buyers</li>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>You value privacy and don&apos;t want your home publicly listed, photographed, or walked through by strangers</li>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>You want to move quickly and a willing buyer already exists</li>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>The property is in a location or price bracket where off-market sales are common and buyers actively seek private opportunities</li>
              </ul>
              <p>
                If none of these apply — if you don&apos;t know whether demand exists and need broad market exposure to find a buyer — a traditional agent or online listing service is likely the more practical route.
              </p>

              <h2>The legal process is the same either way</h2>
              <p>
                Regardless of how you find your buyer, the legal process for transferring ownership of a residential property in England and Wales is identical. Both parties instruct solicitors. Searches are conducted. A contract is exchanged and completion follows. The conveyancing timeline is typically 8–16 weeks from offer to completion, and this doesn&apos;t change meaningfully whether or not an agent was involved.
              </p>
              <p>
                What does change is how the buyer was found, and how much it cost to find them.
              </p>
            </div>
          </div>
        </section>

        {/* Check demand CTA block */}
        <section className="section section-gold">
          <div className="container-narrow">
            <p className="section-label">Start here</p>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-4)' }}>
              Check whether buyers are already registered at your address
            </h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65, marginBottom: 'var(--space-8)', maxWidth: 560 }}>
              Before you call an agent or commit to any marketing, find out whether demand already exists. It&apos;s free, it takes 30 seconds, and it creates no obligation.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link href="/sellers/check" className="btn btn-primary btn-lg">
                Check demand at my address
              </Link>
              <Link href="/pricing" className="btn btn-outline-dark btn-lg">
                See seller pricing
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
          <div className="container-narrow">
            <p className="section-label">Questions</p>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>
              Common questions
            </h2>
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
          </div>
        </section>

        {/* CTA */}
        <section className="section section-dark">
          <div className="container">
            <div className="two-col-grid" style={{ gap: 'var(--space-4)' }}>
              <div className="split-card split-card-buyer" style={{ background: 'var(--forest-soft)' }}>
                <div className="split-card-eyebrow">For buyers</div>
                <h3 className="split-card-headline">Looking for a home that isn&apos;t listed?</h3>
                <p className="split-card-sub">
                  Register your interest in any address, street, or area. We match you to sellers automatically — and can approach owners on your behalf.
                </p>
                <Link href="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
                  Register free
                </Link>
              </div>
              <div className="split-card split-card-seller">
                <div className="split-card-eyebrow">For sellers</div>
                <h3 className="split-card-headline">Find out if buyers are waiting before you list.</h3>
                <p className="split-card-sub">
                  Check real demand at your address for free. If buyers are registered, connect with them directly — no agent, no commission.
                </p>
                <Link href="/sellers/check" className="btn btn-outline-dark" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
                  Check demand — free
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
