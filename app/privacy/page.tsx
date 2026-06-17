export const metadata = { title: 'Privacy policy | Intentory' };
export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="prose">
          <h1>Privacy policy</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p>This privacy policy explains how Intentory collects, uses, and stores your personal data when you use our platform.</p>
          <h2>What we collect</h2>
          <p>We collect information you provide when registering an account (name, email address, password), registering buying interest (location, budget, buying position, timeline), or registering a property as available (address, property details). We also collect standard usage data such as pages visited and timestamps.</p>
          <h2>How we use your data</h2>
          <p>Your data is used to match buyers with relevant seller opportunities, send alerts when a matching interest or property is registered, and facilitate private introductions. We do not sell your data to third parties, estate agents, or portals.</p>
          <h2>Data sharing</h2>
          <p>Your personal details are never shared with homeowners or buyers without your explicit consent. When a paid introduction is initiated, we share only the details you have approved for sharing.</p>
          <h2>Data retention</h2>
          <p>Your account and registered interests remain active until you choose to delete them. You can remove any interest or property from your account at any time.</p>
          <h2>Contact</h2>
          <p>For any privacy-related queries, contact us at privacy@intentory.co.uk.</p>
          <p><em>This policy is a placeholder and should be reviewed by a qualified legal professional before this service is made publicly available.</em></p>
        </div>
      </div>
    </section>
  );
}
