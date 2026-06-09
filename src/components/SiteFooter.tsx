import { Link } from "react-router-dom";

const links = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/agri-wiki", label: "Agri-Wiki" },
];

const SiteFooter = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 text-gray-700 text-xs sm:text-sm py-3 px-3">
      <nav
        aria-label="Footer"
        className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
      >
        {links.map((l, i) => (
          <span key={l.to} className="flex items-center gap-x-3">
            <Link
              to={l.to}
              className="hover:text-gray-900 hover:underline transition-colors"
            >
              {l.label}
            </Link>
            {i < links.length - 1 && <span className="text-gray-500">|</span>}
          </span>
        ))}
      </nav>
      <p className="text-center text-[10px] text-gray-700 mt-1">
        © {new Date().getFullYear()} Bharat AI · Founded by Jaswant
      </p>
    </footer>
  );
};

export default SiteFooter;
