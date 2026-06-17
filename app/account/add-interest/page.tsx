import AddInterestForm from './AddInterestForm';

export const metadata = { title: 'Add interest | Intentory' };

export default function AddInterestPage() {
  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Register buying interest</h1>
          <p className="account-page-sub">Tell us where you want to buy. We&apos;ll alert you when a matching opportunity appears.</p>
        </div>
      </div>
      <AddInterestForm />
    </>
  );
}
