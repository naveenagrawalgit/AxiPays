import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CreditCard, LayoutDashboard, Menu } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Checkout", icon: <CreditCard size={16} /> },
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  ];

  return (
    <header className="bg-white   sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <CreditCard size={24} style={{ color: "#1a56db" }} />
            <span className="text-xl font-bold" style={{ color: "#1a56db" }}>
              AXIPAYS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#1a56db] ${
                  location.pathname === item.path
                    ? "text-[#1a56db] border-b-2 border-[#1a56db] pb-1"
                    : "text-stone-600"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <details className="dropdown dropdown-end">
              <summary className="btn btn-ghost btn-sm p-2">
                <Menu size={20} className="text-stone-600" />
              </summary>
              <ul className="dropdown-content menu bg-white shadow-xl border border-stone-200 w-52 mt-2 p-2 z-50">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 text-sm ${
                        location.pathname === item.path ? "text-[#1a56db] font-medium" : "text-stone-600"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;