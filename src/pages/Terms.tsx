import StaticPage from "@/components/StaticPage";

const Terms = () => (
  <StaticPage
    title="Terms & Conditions"
    description="Terms of use for Bharat AI: informational nature of Fasal Doctor and AI advice, liability limitations, and acceptable use."
    path="/terms"
  >
    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Terms & Conditions</h1>
    <article className="text-foreground/90 space-y-4 leading-relaxed">
      <p>By using Bharat AI, you agree to the following terms:</p>
      <h2 className="text-xl font-semibold mt-6">1. Informational Purposes Only</h2>
      <p>
        The Fasal Doctor, agri-math calculators, and all other AI tools on
        Bharat AI provide suggestions based on rule-based logic and curated
        ICAR-aligned data. They do not replace professional agricultural
        scientists, KVK officers, registered pesticide dealers, RTO officials,
        or financial advisors. Always verify chemical names, dosages, and
        financial decisions independently before acting.
      </p>
      <h2 className="text-xl font-semibold mt-6">2. AI Output Disclaimer</h2>
      <p>
        AI can make mistakes. Recommendations are generated automatically and
        may contain errors, outdated data, or content that does not match your
        local agro-climatic zone. Please double-check every recommendation
        with a local expert before use.
      </p>
      <h2 className="text-xl font-semibold mt-6">3. Limitation of Liability</h2>
      <p>
        Bharat AI and its founder are not liable for any crop loss, financial
        loss, health impact, or other damages resulting from the use of
        information provided by the platform.
      </p>
      <h2 className="text-xl font-semibold mt-6">4. Acceptable Use</h2>
      <p>
        You agree not to use Bharat AI for any unlawful purpose, to harass
        other users, to attempt to reverse-engineer the platform, or to scrape
        content in bulk without written permission.
      </p>
      <h2 className="text-xl font-semibold mt-6">5. Changes</h2>
      <p>
        We may update these Terms periodically. Continued use of the platform
        after changes constitutes acceptance of the revised Terms.
      </p>
    </article>
  </StaticPage>
);

export default Terms;
