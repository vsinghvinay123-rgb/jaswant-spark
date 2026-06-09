import StaticPage from "@/components/StaticPage";

const Contact = () => (
  <StaticPage
    title="Contact Us"
    description="Reach the Bharat AI team for support, partnerships, AdSense queries, or feedback. Founded by Jaswant, based in Sardarshahar, Rajasthan, India."
    path="/contact"
  >
    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Contact Us</h1>
    <article className="text-foreground/90 space-y-4 leading-relaxed">
      <p>
        We genuinely value every user of Bharat AI and try to respond to all
        legitimate enquiries within two working days. Whether you are a farmer
        with a question about a Fasal Doctor recommendation, a developer
        interested in partnership, a journalist, or an AdSense / advertising
        contact, please use the details below.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Founder & CEO:</strong> Jaswant</li>
        <li><strong>Phone / WhatsApp:</strong> +91-9024363501</li>
        <li><strong>Location:</strong> Sardarshahar, Churu district, Rajasthan, India</li>
        <li><strong>Hours:</strong> Monday to Saturday, 10:00 – 19:00 IST</li>
      </ul>
      <p>
        For business inquiries, AdSense support, copyright notices, or
        general feedback, please reach out through WhatsApp for the fastest
        response. We do not collect personal chat data on our servers — see
        our Privacy Policy for full details.
      </p>
    </article>
  </StaticPage>
);

export default Contact;
