"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { handleLogout } from "./action";
import LinkCustom from "@/packages/translation/Link";

// Menu trigger button component
const MenuTrigger = ({ isCollapsed, onMouseEnter, onMouseLeave }) => {
  if (isCollapsed) return null;

  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative flex items-center justify-center w-12 h-12 
                 bg-white border border-gray-200 rounded-xl shadow-sm
                 hover:shadow-md hover:border-gray-300 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Open menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-600 group-hover:text-gray-800 transition-colors"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </svg>
    </button>
  );
};

// Menu arrow component
const MenuArrow = ({ isCollapsed }) => {
  const baseClasses = "absolute w-3 h-3 bg-white border rotate-45 z-0";

  if (isCollapsed) {
    return (
      <div className={`${baseClasses} border-r-0 border-b-0 -left-1.5 bottom-6`} />
    );
  }

  return (
    <div
      className={`${baseClasses} border-l-0 border-t-0 left-4 -bottom-1.5`}
    />
  );
};

// Menu items component
const MenuItems = ({ onLogout }) => {
  const menuItems = [
    {
      type: "link",
      href: "/",
      title: "Trang chủ",
      label: "Xem trang chủ",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      type: "button",
      label: "Đăng xuất",
      onClick: onLogout,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-2">
      {menuItems.map((item, index) => {
        const isLast = index === menuItems.length - 1;
        const baseItemClasses = `
          flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700
          hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150
          ${index === 0 ? "rounded-t-lg" : ""}
          ${isLast ? "rounded-b-lg" : ""}
        `;

        if (item.type === "link") {
          return (
            <LinkCustom
              key={item.href}
              href={item.href}
              title={item.title}
              className={baseItemClasses}
            >
              {item.icon}
              <span>{item.label}</span>
            </LinkCustom>
          );
        }

        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`${baseItemClasses} w-full text-left`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Main dropdown menu component
const DropdownMenu = ({
  isCollapsed,
  showMenu,
  onMouseEnter,
  onMouseLeave,
  onLogout,
}) => {
  const getMenuPositionClasses = () => {
    if (isCollapsed) {
      return "left-full bottom-[-30px] ml-3";
    }
    return "bottom-full left-0 mb-3";
  };

  const getMenuVisibilityClasses = () => {
    return showMenu
      ? "opacity-100 visible translate-y-0 scale-100"
      : "opacity-0 invisible translate-y-2 scale-95 pointer-events-none";
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        absolute z-50 ${getMenuPositionClasses()}
        transform transition-all duration-200 ease-out
        ${getMenuVisibilityClasses()}
      `}
    >
      <div className="relative">
        <MenuArrow isCollapsed={isCollapsed} />
        <div className={`bg-white rounded-xl shadow-lg border relative z-10 border-gray-200 min-w-[220px] overflow-hidden`}>
          <MenuItems onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
};

// Main component
const MenuProfile = ({
  name,
  email,
  isCollapsed,
  showMenu,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const router = useRouterCustom();

  const logout = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    return router.push("/dang-nhap");
  };

  return (
    <div className="relative">
      <MenuTrigger
        isCollapsed={isCollapsed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <DropdownMenu
        isCollapsed={isCollapsed}
        showMenu={showMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onLogout={logout}
      />
    </div>
  );
};

export default MenuProfile;
