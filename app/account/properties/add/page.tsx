import AddPropertyForm from './AddPropertyForm';

export const metadata = { title: 'Register a property | Intentory' };

export default function AddPropertyPage() {
  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Register a property</h1>
          <p className="account-page-sub">Register your property as privately available. We&apos;ll match it to buyers who have already registered interest.</p>
        </div>
      </div>
      <AddPropertyForm />
    </>
  );
}
