import { Metadata } from 'next';

const BASE_URL = 'https://property-interest-sepia.vercel.app';
const SITE_NAME = 'Intentory';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/hero.png`;

const DEFAULT_DESCRIPTION =
  'Intentory is the private property demand platform. Buyers register interest in specific homes, streets or areas. Sellers discover real demand at their address — before going to market.';

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ── Structured data helpers ──────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Intentory',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Intentory',
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/check-demand?postcode={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqSchema(
  items: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Intentory — Private Property Demand Platform',
    description: DEFAULT_DESCRIPTION,
    provider: {
      '@type': 'Organization',
      name: 'Intentory',
      url: BASE_URL,
    },
    serviceType: 'Property matching service',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Register Buyer Interest',
        description: 'Free registration of property buying interest at a specific address, street, or area.',
        price: '0',
        priceCurrency: 'GBP',
      },
      {
        '@type': 'Offer',
        name: 'Owner Approach',
        description: 'We contact the homeowner at your target address on your behalf.',
        price: '29',
        priceCurrency: 'GBP',
      },
      {
        '@type': 'Offer',
        name: 'Street Outreach',
        description: 'Reach every homeowner on your target street.',
        price: '99',
        priceCurrency: 'GBP',
      },
      {
        '@type': 'Offer',
        name: 'Area Outreach',
        description: 'Broadcast your interest across a full area or postcode district.',
        price: '199',
        priceCurrency: 'GBP',
      },
    ],
  };
}
