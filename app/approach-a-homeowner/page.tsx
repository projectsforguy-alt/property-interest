import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to approach a homeowner about buying their house',
  description:
    'A practical guide to approaching a homeowner about buying their property privately in the UK — what to say, how to write the letter, and what to expect.',
  alternates: {
    canonical: 'https://property-interest-sepia.vercel.app/approach-a-homeowner',
  },
  openGraph: {
    title: 'How to approach a homeowner about buying their house | Intentory',
    description:
      'What to say, how to write the letter, and what to expect when approaching a homeowner privately in the UK.',
    url: 'https://property-interest-sepia.vercel.app/approach-a-homeowner',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to approach a homeowner about buying their house',
  description:
    'A practical guide to approaching a homeowner about buying their property privately in the UK.',
  author: {
    '@type': 'Organization',
    name: 'Intentory',
    url: 'https://property-interest-sepia.vercel.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Intentory',
    url: 'https://property-interest-sepia.vercel.app',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://property-interest-sepia.vercel.app/approach-a-homeowner',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it legal to approach a homeowner about buying their house?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely. There is nothing legally unusual about approaching a homeowner privately. Many UK property transactions begin this way. As long as the approach is respectful and the owner is free to decline, it is entirely legitimate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best way to approach a homeowner about buying their house?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A personally addressed letter is the most effective approach. It gives the owner time to consider your interest without pressure, conveys seriousness, and provides a clear way to respond. Cold knocking tends to put people on the spot and produces worse outcomes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I say when approaching a homeowner?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Be specific about the property, explain why you want it, state your buying position clearly (cash buyer, mortgage agreed), and make it easy for them to respond without obligation. Keep it brief — a homeowner who is interested will follow up; a long letter does not improve your chances.',
      },
    },
    {
      '@type': 'Question',
      name: 'How likely is a homeowner to respond to an approach letter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Response rates vary significantly by area, property type, and how the letter is written. A credible, personal letter to the right property at the right time can be highly effective. Many homeowners are in passive consideration — open to selling but not actively looking to list — and a genuine approach can change their decision.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Intentory contact a homeowner on my behalf?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Intentory\'s owner approach service researches the registered owner of any UK residential property and sends a personally addressed letter on your behalf, including a private response link. This costs £29 per property.',
      },
    },
  ],
};

const STEPS = [
  {
    n: '01',
    title: 'Be specific about which property you want',
    body: 'Vague approaches get vague responses. A letter that references the specific property — its address, what you like about it, why you want to live there — reads as genuine. A generic letter that could have been sent to any house on the street reads as a bulk marketing exercise and is likely to be dismissed.',
  },
  {
    n: '02',
    title: 'State your buying position clearly',
    body: 'A homeowner\'s biggest concern about an unsolicited approach is whether the buyer is serious and capable of completing. Address this directly: are you a cash buyer, do you have a mortgage agreed in principle, do you have a property to sell? The clearer your position, the more credible the approach.',
  },
  {
    n: '03',
    title: 'Make it easy to say no — and easy to say yes',
    body: 'Don\'t pressure the owner. The letter should make clear that you understand if they\'re not interested, and that there\'s no obligation to respond. Paradoxically, removing pressure increases the likelihood of a positive response. At the same time, give them a simple, private way to get in touch if they are interested — a dedicated email, a phone number, or a private response link.',
  },
  {
    n: '04',
    title: 'Keep it brief',
    body: 'One page is enough. A homeowner who is genuinely interested will follow up regardless of how much detail you provide. A homeowner who isn\'t interested will not be converted by a longer letter. Get the key points across — who you are, what you want, why, and how to respond — and stop.',
  },
  {
    n: '05',
    title: 'Send it by post, addressed by name',
    body: 'A physical letter addressed to the owner by name carries significantly more weight than a leaflet or a note through the door. It signals that you\'ve done your research, that this isn\'t a mass campaign, and that you\'re serious. The owner\'s name can be found via Land Registry title records, which are publicly available.',
  },
  {
    n: '06',
    title: 'Follow up once, then wait',
    body: 'If you don\'t hear back within a few weeks, one follow-up letter is reasonable. Beyond that, repeated contact risks damaging your chances — a homeowner who might have considered your approach can become resistant if they feel pursued. Patience is part of the process.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is it legal to approach a homeowner about buying their house?',
    a: 'Yes, completely. There is nothing legally unusual about approaching a homeowner privately. Many UK property transactions begin this way. As long as the approach is respectful and the owner is free to decline, it is entirely legitimate.',
  },
  {
    q: 'What is the best way to approach a homeowner about buying their house?',
    a: 'A personally addressed letter is the most effective approach. It gives the owner time to consider your interest without pressure, conveys seriousness, and provides a clear way to respond. Cold knocking tends to put people on the spot and produces worse outcomes.',
  },
  {
    q: 'What should I say when approaching a homeowner?',
    a: 'Be specific about the property, explain why you want it, state your buying position clearly (cash buyer, mortgage agreed), and make it easy for them to respond without obligation. Keep it brief — a homeowner who is interested will follow up; a long letter does not improve your chances.',
  },
  {
    q: 'How likely is a homeowner to respond to an approach letter?',
    a: 'Response rates vary significantly by area, property type, and how the letter is written. A credible, personal letter to the right property at the right time can be highly effective. Many homeowners are in passive consideration — open to selling but not actively looking to list — and a genuine approach can change their decision.',
  },
  {
    q: 'Can Intentory contact a homeowner on my behalf?',
    a: 'Yes. Intentory\'s owner approach service researches the registered owner of any UK residential property and sends a personally addressed letter on your behalf, including a private response link. This costs £29 per property.',
  },
  {
    q: 'What if the homeowner says no?',
    a: 'Respect the decision and move on. A homeowner who declines today may reconsider in future — particularly if their circumstances change. Some buyers register ongoing interest through Intentory so they\'re notified if the owner later decides to sell.',
  },
];

export default function ApproachAHomeownerPage() {
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

        {/* Hero — split layout with front door image */}
        <div className="hero-layout" style={{ background: 'var(--navy)', minHeight: 520 }}>
          <div className="hero-text" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-16)' }}>
            <p className="section-label">Buyer guide</p>
            <h1 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              How to approach a homeowner about buying their house
            </h1>
            <p className="section-sub section-sub-light" style={{ marginBottom: 'var(--space-8)' }}>
              Many UK homeowners would consider selling if approached in the right way. This guide covers what works, what doesn&apos;t, and how to give yourself the best chance of a positive response.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Register interest free
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-lg">
                See owner approach pricing
              </Link>
            </div>
          </div>
          <div className="hero-img-wrap">
            <Image
              src="/images/approach-hero.jpg"
              alt="A classic UK front door with brass letterbox"
              fill
              className="hero-img"
              priority
              sizes="50vw"
              style={{ objectPosition: 'center center' }}
            />
            <div className="hero-img-fade" />
          </div>
        </div>

        {/* Why it works */}
        <section className="section" style={{ background: 'var(--white)' }}>
          <div className="container-narrow">
            <div className="prose" style={{ maxWidth: '100%' }}>
              <h2>Why approaching a homeowner directly can work</h2>
              <p>
                The assumption most buyers make is that if a property isn&apos;t listed, it isn&apos;t for sale. This is often wrong. A significant number of homeowners are in a state of passive consideration — they&apos;d sell for the right price to the right buyer, but they haven&apos;t committed to a full agent campaign because they&apos;re not ready for the disruption, the uncertainty, or the cost.
              </p>
              <p>
                A genuine, well-written approach from a serious buyer can change that calculation. If someone is offering a fair price with no fuss, the appeal of avoiding an agent, avoiding viewings from strangers, and proceeding on their own terms can be compelling — particularly for homeowners who value privacy or are in no rush.
              </p>
              <p>
                This is not a long shot. It is a normal part of how UK property transactions happen, particularly in competitive areas and specific streets where properties rarely come to open market.
              </p>

              <h2>Letter versus knocking on the door</h2>
              <p>
                Knocking on someone&apos;s door to ask if they&apos;d sell their house puts them in an uncomfortable position. They have to respond immediately, in person, without any time to think — and most people will say no simply to end an awkward encounter, regardless of whether they&apos;d actually consider selling.
              </p>
              <p>
                A letter does the opposite. It arrives when the owner is ready to read it, gives them time to think, and lets them respond (or not) without any social pressure. A well-written letter to the right property at the right time can produce a response weeks or months later, when the owner&apos;s circumstances have shifted and your approach comes to mind.
              </p>
              <p>
                Always use a letter. It is more effective and more respectful.
              </p>

              <h2>How to write an effective approach letter</h2>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', margin: 'var(--space-8) 0' }}>
              {STEPS.map((step) => (
                <div key={step.n} style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--teal)', flexShrink: 0, width: 28, paddingTop: 2 }}>{step.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--navy)', marginBottom: 'var(--space-2)' }}>{step.title}</div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.7, margin: 0 }}>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="prose" style={{ maxWidth: '100%' }}>
              <h2>Finding out who owns a property</h2>
              <p>
                To address a letter to the owner by name, you need to know who owns the property. In England and Wales, property ownership is recorded at HM Land Registry, and title registers are publicly available for a small fee (currently £3 per title). You can search by address at <a href="https://www.gov.uk/search-property-information-land-registry" target="_blank" rel="noopener noreferrer">gov.uk</a>.
              </p>
              <p>
                Note that not all properties are registered — particularly older ones that haven&apos;t changed hands recently. In those cases, ownership research requires more effort, and the Land Registry search may return no result.
              </p>
              <p>
                Intentory handles this research as part of the owner approach service. We identify the registered owner, produce a personally addressed letter, and provide a private response link — so the owner can respond in confidence without committing to anything.
              </p>

              <h2>What to do when an owner responds positively</h2>
              <p>
                Move quickly, but don&apos;t appear desperate. Confirm your interest, arrange a viewing if the owner is willing, and have your finances in order before that conversation happens. A seller who agrees to a private approach does so partly to avoid uncertainty — a buyer who appears well-prepared and decisive reinforces the decision.
              </p>
              <p>
                If the owner is open to selling but hasn&apos;t agreed a price, engage a local estate agent or RICS surveyor for a valuation so you&apos;re negotiating from an informed position. Both parties should instruct solicitors early in the process.
              </p>

              <h2>What to do when an owner says no</h2>
              <p>
                Respect it and move on. A homeowner who declines today may reconsider if their circumstances change — a job move, a family change, a shift in financial priorities. Some buyers leave a note with their contact details so the owner has a way to get in touch if they do decide to sell.
              </p>
              <p>
                Registering your interest with Intentory means you&apos;ll be notified automatically if that owner later registers the property as privately available — without you having to do anything further.
              </p>
            </div>
          </div>
        </section>

        {/* Intentory's role */}
        <section className="section section-teal">
          <div className="container-narrow">
            <p className="section-label">How Intentory helps</p>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>
              We handle the approach on your behalf
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginBottom: 'var(--space-10)' }}>
              {[
                {
                  title: 'Owner identified',
                  body: 'We research the registered owner of your target property via Land Registry and available records.',
                },
                {
                  title: 'Personal letter produced',
                  body: 'A personally addressed letter is written and sent on your behalf, explaining your genuine interest in that specific property.',
                },
                {
                  title: 'Private response link included',
                  body: 'The owner receives a private link they can use to respond in confidence — without any obligation and without your contact details being shared until they choose to connect.',
                },
                {
                  title: 'You\'re notified of any response',
                  body: 'If the owner responds, you\'re notified through your Intentory account and can begin a private conversation.',
                },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l4 4 8-8" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--navy)', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary">
                Register interest free
              </Link>
              <Link href="/pricing" className="btn btn-outline-dark">
                Owner approach — £29
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
          <div className="container-narrow" style={{ textAlign: 'center' }}>
            <h2 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              Ready to make your approach?
            </h2>
            <p className="section-sub section-sub-light" style={{ margin: '0 auto var(--space-8)' }}>
              Register your interest free, or let us contact the homeowner on your behalf for £29.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Register interest free
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-lg">
                See pricing
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
