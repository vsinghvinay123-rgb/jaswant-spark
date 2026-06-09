import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/agri-wiki", label: "Agri-Wiki" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const SiteHeader = () => {
  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-50">
      <nav
        aria-label="Primary"
        className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3"
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🇮🇳</span>
          <span className="font-heading font-bold text-base tracking-wide">
            <span className="text-saffron">BHARAT</span>{" "}
            <span className="text-green-india">AI</span>
          </span>
        </Link>
        <ul className="flex items-center gap-1 sm:gap-3 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-2 py-1 rounded-md transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default SiteHeader;
