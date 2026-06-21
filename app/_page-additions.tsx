// ─────────────────────────────────────────────────────────────────────────────
// ADD TO app/page.tsx
// Place this import at the top of the file (alongside your existing imports):
//
//   import { buildMetadata, faqSchema } from '@/lib/metadata';
//
// Then add this metadata export before your default export:
// ─────────────────────────────────────────────────────────────────────────────

import { Metadata } from 'next';
import { buildMetadata, faqSchema } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'The home you want probably isn\'t listed',
  description:
    'Intentory is the private property demand platform. Buyers register interest in specific homes, streets or areas for free. Sellers discover real buyer demand before going to market.',
  path: '/',
});

// ─────────────────────────────────────────────────────────────────────────────
// FAQ DATA — add this const before your page component, and render
// the <script> tag and <HomeFAQ> section inside your page JSX.
// See the FAQ section code below.
// ─────────────────────────────────────────────────────────────────────────────

const HOME_FAQ_ITEMS = [
  {
    question: 'Can I buy a house that isn\'t for sale?',
    answer:
      'Yes. Many owners would consider selling if approached correctly. Intentory lets you register interest in any address and — if you choose — we contact the owner on your behalf with a personal letter.',
  },
  {
    question: 'What is off-market property?',
    answer:
      'Off-market property is a home sold or negotiated privately, without a Rightmove or Zoopla listing. These deals happen more often than most buyers realise, particularly in high-demand streets and villages.',
  },
  {
    question: 'How much does it cost to register interest?',
    answer:
      'Registering buyer interest is completely free. You only pay if you choose to take an active step: owner approach (£29), street outreach (£99), or area outreach (£199).',
  },
  {
    question: 'How do sellers use Intentory?',
    answer:
      'Sellers enter their postcode to see whether any buyers have already registered interest at their address, street, or area. They can then register as privately available and broadcast to matched buyers for £49.',
  },
  {
    question: 'Is my registration kept private?',
    answer:
      'Yes. Individual buyer registrations are never publicly visible. Sellers only see that demand exists — not who the buyers are — until both parties agree to connect.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ADD THIS SECTION to your homepage JSX, before the </main> closing tag.
// Also add the JSON-LD script tag inside your page component return:
//
//   <script
//     type="application/ld+json"
//     dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(HOME_FAQ_ITEMS)) }}
//   />
// ─────────────────────────────────────────────────────────────────────────────

export function HomeFAQSection() {
  return (
    <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
      <div className="container-narrow">
        <p className="section-label">FAQ</p>
        <h2 className="section-headline" style={{ marginBottom: 'var(--space-8)' }}>
          Common questions
        </h2>
        <div className="faq-list">
          {HOME_FAQ_ITEMS.map(({ question, answer }) => (
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
      </div>
    </section>
  );
}
