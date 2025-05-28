import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className=" bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 dark:text-neutral-300 mt-auto border-t border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-center md:text-left select-none">
          &copy; {new Date().getFullYear()} Susekh. All rights reserved.
        </p>

        <nav className="flex space-x-6 text-sm font-medium">
          {[
            { to: "/", label: "Home" },
            { to: "/features", label: "Features" },
            { to: "/pricing", label: "Pricing" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500"
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
