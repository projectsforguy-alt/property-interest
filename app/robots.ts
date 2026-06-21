import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/api'],
      },
    ],
    sitemap: 'https://property-interest-sepia.vercel.app/sitemap.xml',
  };
}
