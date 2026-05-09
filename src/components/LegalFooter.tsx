import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type PageKey = "about" | "contact" | "privacy" | "terms";

const PAGES: Record<PageKey, { title: string; body: string }> = {
  about: {
    title: "About Us",
    body: `Welcome to Bharat AI. Founded by Jaswant, an innovative tech creator from Sardarshahar, Rajasthan. Bharat AI is India's premier artificial intelligence platform designed to empower citizens. From our advanced 'Fasal Doctor' assisting farmers with crop diagnostics, to smart tools for finance and education, our mission is to make high-end AI technology accessible to everyone in rural and urban India.`,
  },
  contact: {
    title: "Contact Us",
    body: `We value our users and are always here to help.

• Founder & CEO: Jaswant
• Phone / WhatsApp: +91-9024363501
• Location: Sardarshahar, Churu, Rajasthan, India

For business inquiries, AdSense support, or general feedback, please reach out to us.`,
  },
  privacy: {
    title: "Privacy Policy",
    body: `At Bharat AI, the privacy of our visitors is of extreme importance to us.

Log Files & Data: We do not store personal chat data on our servers.

Cookies and Web Beacons: We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. Google uses cookies (such as the DoubleClick DART cookie) to serve ads based on a user's prior visits to our website or other websites. Users may opt-out of personalized advertising by visiting Google's Ads Settings.`,
  },
  terms: {
    title: "Terms & Conditions",
    body: `By using Bharat AI, you agree to the following terms:

1. Informational Purposes Only: The Fasal Doctor and financial AI tools provide suggestions based on machine learning. They do not replace professional agricultural scientists, RTO officials, or financial advisors.

2. Liability: Bharat AI and its founder are not liable for any crop loss, financial loss, or damages resulting from the use of the information provided by the AI. Always verify chemical dosages and financial decisions independently.`,
  },
};

const LegalFooter = () => {
  const [open, setOpen] = useState<PageKey | null>(null);

  const links: { key: PageKey; label: string }[] = [
    { key: "about", label: "About Us" },
    { key: "contact", label: "Contact Us" },
    { key: "privacy", label: "Privacy Policy" },
    { key: "terms", label: "Terms & Conditions" },
  ];

  return (
    <>
      <footer className="w-full bg-gray-50 border-t border-gray-200 text-gray-600 text-xs sm:text-sm py-2 px-3">
        <nav className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {links.map((l, i) => (
            <span key={l.key} className="flex items-center gap-x-3">
              <button
                onClick={() => setOpen(l.key)}
                className="hover:text-gray-900 hover:underline transition-colors"
              >
                {l.label}
              </button>
              {i < links.length - 1 && <span className="text-gray-300">|</span>}
            </span>
          ))}
        </nav>
        <p className="text-center text-[10px] text-gray-400 mt-1">
          © {new Date().getFullYear()} Bharat AI · Founded by Jaswant
        </p>
      </footer>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white text-gray-900">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {PAGES[open].title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {PAGES[open].title} of Bharat AI
                </DialogDescription>
              </DialogHeader>
              <article className="prose prose-sm max-w-none text-gray-800 whitespace-pre-line leading-relaxed text-[15px]">
                {PAGES[open].body}
              </article>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalFooter;
