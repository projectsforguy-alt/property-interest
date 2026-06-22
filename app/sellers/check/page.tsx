import type { Metadata } from 'next';
import Link from 'next/link';
import DemandCheckForm from './DemandCheckForm';
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: 'Check buyer demand at your address',
  description:
    'Find out instantly whether buyers have registered interest in your property, street, or area — free, no account required.',
  alternates: {
    canonical: 'https://property-interest-sepia.vercel.app/sellers/check',
  },
};

export default function SellerCheckPage() {
  return (
    <>
      <section className="section section-dark" style={{ padding: 'var(--space-16) 0 var(--space-12)' }}>
        <div className="container">
          <div className="section-label section-label-dark">Homeowner demand check</div>
          <h1 className="section-headline" style={{ color: 'var(--white)', maxWidth: 560 }}>
            Are buyers already waiting for your home?
          </h1>
          <p className="section-sub section-sub-light">
            Enter your postcode to check whether buyers have registered interest in your property, street, or area. Free, instant, no account required.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <DemandCheckForm />
        </div>
      </section>

      {/* Post-check nudge for sellers who want to proceed */}
      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)', paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginBottom: 'var(--space-4)' }}>
            Ready to register your property and connect with matched buyers?
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register?intent=seller" className="btn btn-primary">
              Create a free seller account
            </Link>
            <Link href="/sellers" className="btn btn-outline-dark">
              Learn how it works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
