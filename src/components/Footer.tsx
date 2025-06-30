import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0a0f1a] via-[#131c38] to-[#0a0f1a]
                       dark:from-black dark:via-[#0a1229] dark:to-black
                       text-gray-400 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 flex-wrap">
        <p className="text-xs text-center md:text-left select-none">
          &copy; {new Date().getFullYear()} Susekh. All rights reserved.
        </p>

        <nav className="flex flex-wrap gap-4 md:gap-6 text-sm font-semibold">
          {[
            { to: "/", label: "Home" },
            { to: "/features", label: "Features" },
            { to: "/pricing", label: "Pricing" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="rounded-md px-3 py-1 transition-colors duration-300 ease-in-out
                         hover:bg-blue-900 hover:text-white
                         dark:hover:bg-blue-800
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
