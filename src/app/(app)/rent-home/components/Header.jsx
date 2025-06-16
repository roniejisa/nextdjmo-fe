// components/Header.jsx
"use client"
import { useState } from "react";
import { Sun, Moon, Home, Menu, X } from "lucide-react";

const Header = ({ isDarkMode, toggleTheme, isScrolled, glassClasses, textPrimaryClasses }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Trang chủ", id: "home" },
    { name: "Nhà cho thuê", id: "properties" },
    { name: "Dịch vụ", id: "services" },
    { name: "Blog", id: "blog" },
    { name: "Liên hệ", id: "contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? glassClasses : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <a
            href="#"
            className={`text-2xl font-bold ${textPrimaryClasses} flex items-center gap-2`}
          >
            <Home className="text-indigo-500" />
            RentHome
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleSmoothScroll(e, `#${item.id}`)}
                  className={`${textPrimaryClasses} hover:text-indigo-500 transition-colors px-4 py-2 rounded-lg hover:bg-white/10`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full ${glassClasses} hover:scale-110 transition-all duration-300`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-3 rounded-full ${glassClasses} hover:scale-110 transition-all duration-300`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="hidden md:block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300"
            >
              Đăng tin
            </a>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 ${glassClasses} rounded-2xl p-6`}>
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleSmoothScroll(e, `#${item.id}`)}
                    className={`block ${textPrimaryClasses} hover:text-indigo-500 transition-colors py-2`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "#contact")}
                  className="block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-center"
                >
                  Đăng tin
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;