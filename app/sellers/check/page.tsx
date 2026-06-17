import DemandCheckForm from './DemandCheckForm';

export const metadata = { title: 'Check demand at your address | Intentory' };

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
    </>
  );
}
