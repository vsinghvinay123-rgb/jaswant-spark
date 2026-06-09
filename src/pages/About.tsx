import StaticPage from "@/components/StaticPage";

const About = () => (
  <StaticPage
    title="About Us"
    description="Bharat AI is India's offline-first agricultural assistant, founded by Jaswant in Sardarshahar, Rajasthan, delivering ICAR-aligned crop diagnostics and farming tools."
    path="/about"
  >
    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">About Bharat AI</h1>
    <article className="prose prose-invert max-w-none text-foreground/90 space-y-4 leading-relaxed">
      <p>
        Bharat AI is an India-first, offline-capable artificial intelligence
        platform built to put practical, ICAR-aligned agricultural intelligence
        in the hands of every farmer, student, and extension officer across the
        country. Founded by <strong>Jaswant</strong>, an independent technology
        creator from Sardarshahar in Churu district, Rajasthan, the project
        began as a Smart India Hackathon prototype and has since grown into a
        full multilingual assistant covering English, Hindi, Hinglish, and
        Marwadi.
      </p>
      <p>
        Our flagship feature, <strong>Fasal Doctor</strong>, lets farmers scan a
        crop, describe symptoms, or pick from a guided checklist to receive an
        evidence-based diagnosis with treatment options, recommended dosages,
        and culturally appropriate explanations. Supporting modules include
        mandi (market) price lookups, water and fertilizer calculators that
        adapt to land size in acres, bighas, or hectares, weather-aware
        advisories, and quick e-governance and Class-10 education helpers.
      </p>
      <p>
        Everything runs on a 100% offline regex-and-rules engine first, so the
        app works in low-connectivity villages just as well as in cities.
        Bharat AI is independent, ad-supported, and committed to keeping its
        core agricultural advice free for every Indian user.
      </p>
    </article>
  </StaticPage>
);

export default About;
