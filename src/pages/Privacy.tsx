import StaticPage from "@/components/StaticPage";

const Privacy = () => (
  <StaticPage
    title="Privacy Policy"
    description="Bharat AI privacy policy: how we handle data, cookies, Google AdSense third-party advertising, and your choices."
    path="/privacy"
  >
    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Privacy Policy</h1>
    <article className="text-foreground/90 space-y-4 leading-relaxed">
      <p>
        At Bharat AI, the privacy of our visitors is of extreme importance to
        us. This Privacy Policy document outlines the types of information that
        are collected and recorded by Bharat AI and how we use it.
      </p>
      <h2 className="text-xl font-semibold mt-6">Log Files & Personal Data</h2>
      <p>
        Bharat AI follows a standard procedure of using log files for
        operational diagnostics. We do not store personal chat conversations on
        our servers; all chat history is kept locally in your browser via
        localStorage and is removed when you clear browser data.
      </p>
      <h2 className="text-xl font-semibold mt-6">Cookies and Web Beacons</h2>
      <p>
        Like most websites, Bharat AI uses cookies to store information
        including visitor preferences and the language they have selected.
      </p>
      <h2 className="text-xl font-semibold mt-6">Google AdSense & Third-Party Cookies</h2>
      <p>
        Google, as a third-party vendor, uses cookies to serve ads on Bharat
        AI. Google's use of the DoubleClick DART cookie enables it to serve
        ads to our users based on their visits to Bharat AI and other sites on
        the Internet. Users may opt out of personalized advertising by visiting
        Google's <a className="text-primary underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>.
      </p>
      <h2 className="text-xl font-semibold mt-6">Children's Information</h2>
      <p>
        Bharat AI does not knowingly collect any Personal Identifiable
        Information from children under the age of 13.
      </p>
      <h2 className="text-xl font-semibold mt-6">Consent</h2>
      <p>
        By using Bharat AI, you hereby consent to our Privacy Policy and agree
        to its terms.
      </p>
    </article>
  </StaticPage>
);

export default Privacy;
