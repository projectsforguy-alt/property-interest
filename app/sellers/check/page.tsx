export const metadata = { title: 'Check demand at your address | Intentory' };

export default function SellerCheckPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="section-label">Homeowner demand check</div>
        <h1 className="section-headline">Check buyer demand at your address</h1>
        <p className="section-sub">Enter your address or postcode to see whether buyers have registered interest in your property, street, or area.</p>
        <div className="form-card" style={{ maxWidth: 480 }}>
          <p style={{ color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>
            This feature is coming soon. In the meantime, register your interest and we will be in touch.
          </p>
        </div>
      </div>
    </section>
  );
}
