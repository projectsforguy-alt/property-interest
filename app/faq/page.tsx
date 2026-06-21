import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — Frequently asked questions',
  description:
    'Everything you need to know about Intentory — how off-market property works, how to approach a homeowner, what sellers can expect, and how our matching and pricing works.',
  alternates: {
    canonical: 'https://property-interest-sepia.vercel.app/faq',
  },
  openGraph: {
    title: 'FAQ | Intentory',
    description:
      'Everything you need to know about buying or selling property privately through Intentory.',
    url: 'https://property-interest-sepia.vercel.app/faq',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I buy a house that isn\'t for sale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many homeowners would consider selling if approached correctly — they simply haven\'t listed because nobody has asked. Intentory lets you register genuine interest in a specific address, street, or area, and we can contact the owner on your behalf with a personal letter. This is known as an off-market approach.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is off-market property?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Off-market property refers to homes that are sold or agreed privately, without being listed on Rightmove, Zoopla, or through an estate agent. These transactions are more common than most people realise — particularly in sought-after streets and villages where owners prefer discretion over a public sale.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to register interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Registering buyer interest is completely free. There is no subscription and no commitment. You only pay if you choose to take an active step: owner approach (£29), street outreach (£99), or area outreach (£199).',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the owner approach work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When you pay for an owner approach (£29), we research the registered owner of your target property and send them a personally addressed letter on your behalf. The letter explains your genuine interest and includes a private response link so the owner can respond in confidence — without any obligation to sell.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is street outreach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Street outreach (£99) sends a personal letter to every homeowner on your target street, letting them know a serious buyer is interested in their road. It\'s ideal when you want to live on a specific street but aren\'t fixed on a particular house.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is area outreach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Area outreach (£199) broadcasts your buying interest across a full postcode district or defined area. It\'s suited to buyers who have a clear target area but flexibility on the specific street or property type.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do sellers use Intentory?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sellers enter their postcode to check whether any buyers have already registered interest at their address, street, or area — for free, with no commitment. If demand exists, they can register as privately available and broadcast to matched buyers for £49, without any public listing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the seller broadcast do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The seller broadcast (£49) notifies every matched buyer in our database that your property is privately available. Matched buyers are those who have registered interest at your exact address, on your street, in your postcode, or in your area.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my registration kept private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Individual buyer registrations are never publicly visible. Sellers only see that demand exists at their address — not who the buyers are — until both parties agree to connect.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does matching work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Intentory matches buyer interests to seller properties at four levels: exact address match, street match, postcode match, and area match. When a match is found, both parties are notified privately. The more specific the match, the stronger the connection.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens when an owner responds to a letter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The owner\'s letter includes a private response link. If they respond positively, we connect them directly with the buyer through Intentory\'s messaging system. If they\'re not interested, you\'re notified and can decide whether to try a different approach. If there\'s no response within a reasonable window, we let you know.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need an estate agent to use Intentory?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Intentory is designed to work independently of estate agents. Buyers and sellers connect privately. If a transaction proceeds, both parties would typically instruct a solicitor for conveyancing — but no agent is required at any point.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas does Intentory cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Intentory covers all of England and Wales. Buyers can register interest at any valid UK postcode, and sellers at any residential address.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I register interest in more than one location?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can register as many interests as you like — across different addresses, streets, postcodes, or areas. Each interest is tracked independently and you\'ll be notified separately for any matches.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Intentory an estate agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Intentory is a private demand platform, not an estate agency. We do not value properties, conduct viewings, or act as an agent in any transaction. We connect buyers and sellers privately and facilitate the initial approach — what happens from there is between the two parties.',
      },
    },
  ],
};

const SECTIONS = [
  {
    label: 'For buyers',
    items: [
      {
        q: 'Can I buy a house that isn\'t for sale?',
        a: 'Yes. Many homeowners would consider selling if approached correctly — they simply haven\'t listed because nobody has asked. Intentory lets you register genuine interest in a specific address, street, or area, and we can contact the owner on your behalf with a personal letter. This is known as an off-market approach.',
      },
      {
        q: 'What is off-market property?',
        a: 'Off-market property refers to homes that are sold or agreed privately, without being listed on Rightmove, Zoopla, or through an estate agent. These transactions are more common than most people realise — particularly in sought-after streets and villages where owners prefer discretion over a public sale.',
      },
      {
        q: 'How much does it cost to register interest?',
        a: 'Registering buyer interest is completely free. There\'s no subscription and no commitment. You only pay if you choose to take an active step: owner approach (£29), street outreach (£99), or area outreach (£199).',
      },
      {
        q: 'How does the owner approach work?',
        a: 'When you pay for an owner approach (£29), we research the registered owner of your target property and send them a personally addressed letter on your behalf. The letter explains your genuine interest and includes a private response link so the owner can respond in confidence — without any obligation to sell.',
      },
      {
        q: 'What is street outreach?',
        a: 'Street outreach (£99) sends a personal letter to every homeowner on your target street, letting them know a serious buyer is interested in their road. It\'s ideal when you want to live on a specific street but aren\'t fixed on a particular house.',
      },
      {
        q: 'What is area outreach?',
        a: 'Area outreach (£199) broadcasts your buying interest across a full postcode district or defined area. It\'s suited to buyers who have a clear target area but flexibility on the specific street or property type.',
      },
      {
        q: 'Can I register interest in more than one location?',
        a: 'Yes. You can register as many interests as you like — across different addresses, streets, postcodes, or areas. Each interest is tracked independently and you\'ll be notified separately for any matches.',
      },
      {
        q: 'What happens when an owner responds to a letter?',
        a: 'The owner\'s letter includes a private response link. If they respond positively, we connect them directly with the buyer through Intentory\'s messaging system. If they\'re not interested, you\'re notified and can decide whether to try a different approach.',
      },
    ],
  },
  {
    label: 'For sellers',
    items: [
      {
        q: 'How do sellers use Intentory?',
        a: 'Sellers enter their postcode to check whether any buyers have already registered interest at their address, street, or area — for free, with no commitment. If demand exists, they can register as privately available and broadcast to matched buyers for £49, without any public listing.',
      },
      {
        q: 'What does the seller broadcast do?',
        a: 'The seller broadcast (£49) notifies every matched buyer in our database that your property is privately available. Matched buyers are those who have registered interest at your exact address, on your street, in your postcode, or in your area.',
      },
      {
        q: 'Do I have to commit to selling if I check demand?',
        a: 'No. Checking demand is completely free and creates zero obligation. You\'re simply finding out whether buyers are registered. You decide at every subsequent step whether to proceed.',
      },
      {
        q: 'Can I sell privately without an estate agent through Intentory?',
        a: 'Yes. Intentory is designed to connect buyers and sellers privately, without the need for an agent. If a match progresses to a transaction, you\'d instruct a solicitor for conveyancing — but no agent is required at any stage.',
      },
      {
        q: 'Is my property address kept confidential?',
        a: 'Yes. Registering as privately available does not create any public listing. Your address is only shared with buyers you agree to connect with.',
      },
    ],
  },
  {
    label: 'How it works',
    items: [
      {
        q: 'How does matching work?',
        a: 'Intentory matches buyer interests to seller properties at four levels: exact address, street, postcode, and area. When a match is found, both parties are notified privately. The more specific the match, the stronger the connection.',
      },
      {
        q: 'What areas does Intentory cover?',
        a: 'Intentory covers all of England and Wales. Buyers can register interest at any valid UK postcode, and sellers at any residential address.',
      },
      {
        q: 'Is Intentory an estate agent?',
        a: 'No. Intentory is a private demand platform, not an estate agency. We do not value properties, conduct viewings, or act as an agent in any transaction. We connect buyers and sellers privately and facilitate the initial approach — what happens from there is between the two parties.',
      },
      {
        q: 'Is my registration kept private?',
        a: 'Yes. Individual buyer registrations are never publicly visible. Sellers only see that demand exists at their address — not who the buyers are — until both parties agree to connect.',
      },
      {
        q: 'Do I need an account to use Intentory?',
        a: 'Yes, a free account is required to register interests or check demand. This lets us notify you of matches and keep your registrations active over time.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="site-main">

        {/* Hero */}
        <section className="section section-dark" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-16)' }}>
          <div className="container-narrow">
            <p className="section-label">FAQ</p>
            <h1 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              Frequently asked questions
            </h1>
            <p className="section-sub section-sub-light" style={{ marginBottom: 0 }}>
              Everything you need to know about buying or selling property privately through Intentory.
            </p>
          </div>
        </section>

        {/* FAQ sections */}
        {SECTIONS.map((section) => (
          <section
            key={section.label}
            className="section"
            style={{ background: 'var(--white)', borderBottom: '1px solid var(--line)', paddingBottom: 'var(--space-12)' }}
          >
            <div className="container-narrow">
              <p className="section-label" style={{ marginBottom: 'var(--space-6)' }}>{section.label}</p>
              <div className="faq-list">
                {section.items.map(({ q, a }) => (
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
        ))}

        {/* CTA */}
        <section className="section section-dark">
          <div className="container-narrow" style={{ textAlign: 'center' }}>
            <h2 className="section-headline" style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
              Still have questions?
            </h2>
            <p className="section-sub section-sub-light" style={{ margin: '0 auto var(--space-8)' }}>
              Read the full guide to how Intentory works, or register your interest and explore the platform.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/how-it-works" className="btn btn-primary btn-lg">
                How it works
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg">
                Register interest free
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
