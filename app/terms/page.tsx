export const metadata = { title: 'Terms of use | Intentory' };
export default function TermsPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="prose">
          <h1>Terms of use</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p>By using Intentory, you agree to these terms. Please read them carefully.</p>
          <h2>What Intentory is</h2>
          <p>Intentory is a private property demand platform. We help buyers register buying intent by location and help homeowners understand whether buyer demand exists before they decide to sell. We are not an estate agency and do not facilitate or guarantee property transactions.</p>
          <h2>Registering interest</h2>
          <p>Registering buying interest does not create any legal obligation on either party. It is a declaration of intent only. Homeowners are under no obligation to respond to, acknowledge, or act on any registered interest.</p>
          <h2>Paid actions</h2>
          <p>Paid actions (owner approaches, outreach campaigns, seller broadcasts) are charged at the rates shown on our pricing page. We do not guarantee a response from any homeowner or buyer. Refunds are not available once a letter has been sent or a broadcast has been dispatched.</p>
          <h2>Acceptable use</h2>
          <p>You may not use Intentory to harass property owners, submit false or misleading information, or circumvent our platform to contact parties directly without consent.</p>
          <h2>Limitation of liability</h2>
          <p>Intentory is not liable for the outcome of any introduction, negotiation, or transaction between buyers and sellers. We provide the platform only.</p>
          <p><em>These terms are a placeholder and should be reviewed by a qualified legal professional before this service is made publicly available.</em></p>
        </div>
      </div>
    </section>
  );
}
