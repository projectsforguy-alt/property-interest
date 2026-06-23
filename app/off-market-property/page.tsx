import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Off-market property — What it is and how to buy it',
  description:
    'Off-market property in the UK explained — what it means, how common it is, who it suits, and how buyers can approach homeowners privately. A practical guide.',
  alternates: {
    canonical: 'https://property-interest-sepia.vercel.app/off-market-property',
  },
  openGraph: {
    title: 'Off-market property — What it is and how to buy it | Intentory',
    description:
      'Off-market property in the UK explained. What it means, how buyers approach homeowners privately, and how sellers benefit from a discreet sale.',
    url: 'https://property-interest-sepia.vercel.app/off-market-property',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Off-market property — What it is and how to buy it in the UK',
  description:
    'A practical guide to off-market property in the UK — what the term means, how common these transactions are, and how buyers can approach homeowners privately.',
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
    '@id': 'https://property-interest-sepia.vercel.app/off-market-property',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is off-market property?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Off-market property refers to homes that are sold or negotiated privately, without being listed on portals like Rightmove or Zoopla, and typically without an estate agent. The transaction happens directly between a buyer and seller — often initiated by the buyer approaching the homeowner.',
      },
    },
    {
      '@type': 'Question',
      name: 'How common are off-market property sales in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Off-market transactions are more common than most buyers realise. Industry estimates suggest that a meaningful proportion of UK property transactions — particularly in sought-after villages, specific streets, and higher price brackets — involve some form of private or pre-market approach.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I buy an off-market property?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most direct route is to approach the homeowner personally, through a letter or introduction. Platforms like Intentory facilitate this by matching registered buyer interest with homeowners who are open to a private sale, and by sending personally addressed letters to owners on behalf of buyers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do sellers choose to sell off-market?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sellers opt for off-market sales for a range of reasons: to avoid the disruption of open viewings, to maintain privacy, to bypass estate agent fees, or because they are open to selling but don\'t want to commit to a full public listing until they know genuine demand exists.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is buying off-market property legal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely. There is nothing unusual or legally complex about an off-market transaction. The conveyancing process is identical to any other property sale — both parties instruct solicitors, searches are conducted, and title is transferred in the usual way.',
      },
    },
  ],
};

export default function OffMarketPropertyPage() {
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

        {/* Hero — split layout with image */}
        <div className="hero-layout" style={{ background: 'var(--navy)', minHeight: 480 }}>
          <div className="hero-text" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-16)' }}>
            <p className="section-label">Guide</p>
            <h1 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              Off-market property — what it is and how to buy it
            </h1>
            <p className="section-sub section-sub-light" style={{ marginBottom: 0 }}>
              A practical guide to private property transactions in the UK — for buyers who want a specific home and sellers who&apos;d prefer a discreet sale.
            </p>
          </div>
          <div className="hero-img-wrap">
            <Image
              src="/images/off-market-hero.jpg"
              alt="A quiet residential close in England with no for-sale boards"
              fill
              className="hero-img"
              priority
              sizes="50vw"
            />
            <div className="hero-img-fade" />
          </div>
        </div>

        {/* Main content */}
        <section className="section" style={{ background: 'var(--white)' }}>
          <div className="container-narrow">

            <div className="prose" style={{ maxWidth: '100%' }}>

              <h2>What is off-market property?</h2>
              <p>
                Off-market property refers to homes that are sold or negotiated privately — without being listed on portals like Rightmove or Zoopla, and typically without a traditional estate agent. The transaction happens directly between a buyer and seller, usually initiated by the buyer making an approach to the homeowner.
              </p>
              <p>
                The term is sometimes used loosely to describe any property that sells before reaching a portal. More precisely, it covers homes where no public listing was ever created — where the buyer and seller found each other through a private introduction, a personal letter, a shared contact, or a platform designed to facilitate exactly this kind of connection.
              </p>

              <h2>How common are off-market sales in the UK?</h2>
              <p>
                More common than most buyers assume. While precise figures are difficult to establish — by nature, these transactions aren&apos;t publicly tracked — anecdotal evidence from estate agents, property lawyers, and private buyers suggests that off-market activity is particularly concentrated in:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>Sought-after villages and rural areas, where homes change hands infrequently and owners prefer a low-profile sale</li>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>Specific streets in urban areas where competition among buyers is unusually high</li>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>Higher price brackets, where sellers prioritise privacy over maximising competing bids</li>
                <li style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>Homeowners who are open to selling but unwilling to commit to the full process unless they know real demand exists</li>
              </ul>
              <p>
                That last group is larger than it might appear. Many homeowners are in a kind of passive consideration — they&apos;d sell for the right price to the right buyer, but they haven&apos;t called an agent because they&apos;re not ready to start viewings, deal with a chain, or pay a commission unless it leads somewhere.
              </p>

              <h2>Why do buyers pursue off-market properties?</h2>
              <p>
                The straightforward answer: because the home they want isn&apos;t listed.
              </p>
              <p>
                Portals only show properties whose owners have already made the decision to sell and instructed an agent. For buyers with a specific target — a particular road, a village, a style of house — this is a small and often unrepresentative subset of what could potentially come to market.
              </p>
              <p>
                A buyer who has decided they want to live on a specific street in a specific town shouldn&apos;t have to wait indefinitely for the right listing to appear. An off-market approach is how they take control of the search — rather than competing on whatever happens to list, they go directly to the people who own what they want.
              </p>
              <p>
                There&apos;s also a practical competitive advantage. When a home lists publicly, it attracts multiple buyers simultaneously. An off-market approach — made privately, before any listing — removes that competition entirely.
              </p>

              <h2>Why do sellers agree to off-market sales?</h2>
              <p>
                Sellers who engage with off-market approaches typically do so for one or more of the following reasons:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', margin: 'var(--space-6) 0' }}>
                {[
                  {
                    title: 'They hadn\'t considered selling — until they were asked',
                    body: 'A credible, personal approach from a genuine buyer can change the calculation. If someone is offering a fair price with no fuss, the appeal of avoiding an agent, avoiding a public sale, and proceeding on their own terms can be significant.',
                  },
                  {
                    title: 'They want to avoid the disruption of a full market sale',
                    body: 'Open days, multiple viewings, uncertainty over chains, and weeks of solicitor back-and-forth are real costs. A private sale with a motivated, qualified buyer can be faster and less stressful.',
                  },
                  {
                    title: 'They prefer discretion',
                    body: 'Not all sellers want their home photographed, listed online, and walked through by strangers. Downsizers, families going through changes, and homeowners in niche markets often prefer a quiet sale.',
                  },
                  {
                    title: 'They save on agent fees',
                    body: 'Estate agent commission in the UK typically runs to 1–3% of the sale price. On an average home, that\'s several thousand pounds. A private sale eliminates that cost entirely.',
                  },
                ].map((item) => (
                  <div key={item.title} style={{ paddingLeft: 'var(--space-5)', borderLeft: '3px solid var(--teal)' }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--navy)', marginBottom: 'var(--space-1)' }}>{item.title}</div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                  </div>
                ))}
              </div>

              <h2>How to buy an off-market property in the UK</h2>
              <p>
                There is no single route, but the most effective approaches share common features: they are personal, credible, and make it easy for the owner to respond.
              </p>

              <h3>1. Identify the properties or areas you want</h3>
              <p>
                Be specific. Vague interest in a town or region is less effective than a clear target — a specific street, a postcode, a village. The more defined your interest, the more credible your approach and the more targeted any outreach can be.
              </p>

              <h3>2. Register your interest formally</h3>
              <p>
                Platforms like Intentory allow you to register buying interest at a specific address, street, or area. This creates a permanent record that can be matched automatically if a seller in that location becomes open to a private sale — without you having to do anything further.
              </p>

              <h3>3. Approach the owner directly</h3>
              <p>
                A personal letter — rather than a door knock or an unsolicited call — is the most effective way to approach a homeowner. It gives them time to consider your interest without pressure, conveys seriousness, and provides a clear way to respond. The letter should be brief, specific about the property, and clear about your buying position.
              </p>
              <p>
                Intentory&apos;s owner approach service handles this on your behalf — identifying the registered owner, writing a personalised letter, and providing a private response link the owner can use to get in touch if interested.
              </p>

              <h3>4. Be prepared to move quickly</h3>
              <p>
                When an owner responds positively, the process can move fast. Having your finances in order — mortgage agreed in principle, or clarity on your cash position — is important. A seller who agrees to a private sale does so partly to avoid uncertainty; a buyer who appears well-prepared and serious is significantly more compelling.
              </p>

              <h2>Is off-market property legal?</h2>
              <p>
                Yes, completely. There is nothing legally unusual about an off-market transaction. The conveyancing process — searches, title transfer, exchange, and completion — is identical to any other property sale. Both parties instruct solicitors, and the deal proceeds through normal legal channels. The only difference is that no portal listing was ever created.
              </p>

              <h2>Off-market property for sellers</h2>
              <p>
                Sellers considering an off-market approach don&apos;t have to wait to be found. Intentory lets homeowners check whether buyers have already registered interest at their address before they commit to anything. If demand exists, they can make themselves privately available to those buyers — without a public listing, without viewings from unqualified strangers, and without agent fees.
              </p>
              <p>
                This represents a meaningful shift in how the early stages of a property sale can work. Rather than the seller announcing publicly and waiting for interest to emerge, Intentory lets sellers see pre-existing interest first — and decide whether it&apos;s worth acting on.
              </p>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)' }}>
          <div className="container-narrow">
            <p className="section-label">Questions</p>
            <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>
              Off-market property — common questions
            </h2>
            <div className="faq-list">
              {[
                {
                  q: 'What is off-market property?',
                  a: 'Off-market property refers to homes that are sold or negotiated privately, without being listed on portals like Rightmove or Zoopla, and typically without an estate agent. The transaction happens directly between a buyer and seller — often initiated by the buyer approaching the homeowner.',
                },
                {
                  q: 'How common are off-market property sales in the UK?',
                  a: 'Off-market transactions are more common than most buyers realise. They\'re particularly concentrated in sought-after villages, specific streets in competitive urban areas, and higher price brackets where sellers prioritise privacy.',
                },
                {
                  q: 'How do I buy an off-market property?',
                  a: 'The most direct route is to approach the homeowner with a personal letter. Platforms like Intentory facilitate this by matching registered buyer interest with homeowners who are open to a private sale, and by sending personally addressed letters to owners on your behalf.',
                },
                {
                  q: 'Why do sellers choose to sell off-market?',
                  a: 'Sellers opt for off-market sales to avoid the disruption of open viewings, to maintain privacy, to bypass estate agent fees, or because they\'re open to selling but don\'t want to commit to a full public listing until they know genuine demand exists.',
                },
                {
                  q: 'Is buying off-market property legal?',
                  a: 'Yes, completely. The conveyancing process is identical to any other property sale. Both parties instruct solicitors, searches are conducted, and title is transferred in the usual way. The only difference is that no portal listing was created.',
                },
              ].map(({ q, a }) => (
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
              <div className="split-card split-card-buyer" style={{ background: 'var(--navy-soft)' }}>
                <div className="split-card-eyebrow">For buyers</div>
                <h3 className="split-card-headline">Register interest in any property.</h3>
                <p className="split-card-sub">
                  Specific address, street, or area. Free to register. We match you automatically — and can approach the owner on your behalf.
                </p>
                <Link href="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
                  Register free
                </Link>
              </div>
              <div className="split-card split-card-seller">
                <div className="split-card-eyebrow">For homeowners</div>
                <h3 className="split-card-headline">See if buyers are already waiting.</h3>
                <p className="split-card-sub">
                  Check real demand at your address before you commit to anything. No obligation. No listing. Completely free.
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
