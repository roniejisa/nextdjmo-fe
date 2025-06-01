"use client";

import LinkCustom from "@/packages/translation/Link";
import { usePathname } from "next/navigation";
import SidebarProfile from "./SidebarProfile";
import useRouterCustom from "@/packages/translation/Navigation";
import React, { useEffect, useState } from "react";
import { iconSVG } from "@/components/Icon/svg/constants";
import useLocalStorage from "@/hooks/useLocalStorage";

const Sidebar = ({ profile, menus: allMenu }) => {
  const router = useRouterCustom();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed, isHydrated] = useLocalStorage(
    "isCollapsed",
    false
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Early returns for invalid states
  if (!profile || !profile.permissions) {
    router.push("/");
    return null;
  }

  const { permissions } = profile;
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

  // Close mobile sidebar when route changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setIsMobileOpen(false);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Utility functions
  const checkActiveMenu = (link, hasChild = false) => {
    if (link === "") {
      return pathname === adminUrl.slice(0, -1) + link
        ? "text-blue-600 font-medium bg-blue-50"
        : "";
    }

    const listLink = link.split("|");
    const sortedLinks = listLink.sort((a, b) => b.length - a.length);

    const isActive = sortedLinks.some((link) => {
      const fullLink = adminUrl + link;
      return (
        pathname === fullLink ||
        pathname.startsWith(fullLink + "/") ||
        pathname.startsWith(fullLink + "?") ||
        pathname.startsWith(fullLink + "#")
      );
    });

    if (isActive) {
      return hasChild
        ? "bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 active font-medium border-r-2 border-blue-500"
        : "text-blue-600 font-medium bg-gradient-to-r from-blue-50 to-blue-50/50 border-r-2 border-blue-500";
    }
    return "";
  };

  const checkActiveMenuChild = (link) => {
    const fullLink = adminUrl + link;
    const isActive =
      pathname === fullLink ||
      pathname.startsWith(fullLink + "/") ||
      pathname.startsWith(fullLink + "?") ||
      pathname.startsWith(fullLink + "#");

    return isActive
      ? "before:bg-blue-500 text-blue-600 font-medium"
      : "before:bg-gray-300";
  };

  const hasPermission = (item) => {
    const lists = item.link.split("|");
    return (
      lists.some((link) => permissions.includes(`${link}.read`)) ||
      item.link === ""
    );
  };

  const filteredMenus = allMenu?.filter(hasPermission) || [];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <SidebarContainer
        isHydrated={isHydrated}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      >
        {/* Header with Toggle */}
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <SidebarMenu isCollapsed={isCollapsed}>
          {filteredMenus.map((item) => (
            <React.Fragment key={item.id}>
              {item.items ? (
                <MenuItemWithChildren
                  item={item}
                  permissions={permissions}
                  adminUrl={adminUrl}
                  pathname={pathname}
                  checkActiveMenu={checkActiveMenu}
                  checkActiveMenuChild={checkActiveMenuChild}
                  isCollapsed={isCollapsed}
                />
              ) : (
                <SingleMenuItem
                  item={item}
                  permissions={permissions}
                  adminUrl={adminUrl}
                  checkActiveMenu={checkActiveMenu}
                  isCollapsed={isCollapsed}
                />
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>

        <SidebarProfile profile={profile} isCollapsed={isCollapsed} />
      </SidebarContainer>
    </>
  );
};

// Sidebar Container Component
const SidebarContainer = ({ children, isCollapsed, isMobileOpen, isHydrated }) => {
  return (
    <aside
      className={`
      fixed lg:relative z-50 h-screen lg:h-[calc(100vh-32px)] 
      bg-white/95 backdrop-blur-xl lg:bg-white
      border-r border-gray-200/80 lg:border lg:border-gray-200/50
      shadow-2xl lg:shadow-xl
      rounded-none lg:rounded-2xl
      flex flex-col
      transition-all duration-300 ease-in-out
      ${isCollapsed ? "lg:w-20" : "lg:w-[300px]"}
      ${
        isMobileOpen
          ? "translate-x-0 w-80"
          : "-translate-x-full lg:translate-x-0"
      }
      lg:w-${isCollapsed ? "20" : "80"}
      ${!isHydrated ? "opacity-50" : "opacity-100"}

    `}
    >
      {children}
    </aside>
  );
};

// Sidebar Header Component
const SidebarHeader = ({ isCollapsed, onToggle, onMobileClose }) => {
  return (
    <div
      className={`flex items-center ${
        !isCollapsed ? "justify-between" : "justify-center"
      } p-4 border-b border-gray-100`}
    >
      {!isCollapsed && (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-gray-900">Admin Panel</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {/* Desktop Toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Mobile Close */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Sidebar Menu Container
const SidebarMenu = ({ children, isCollapsed }) => {
  return (
    <nav className="flex-1 overflow-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <ul className={`space-y-2 ${isCollapsed ? "items-center" : ""}`}>
        {children}
      </ul>
    </nav>
  );
};

// Menu Item with Children Component
const MenuItemWithChildren = ({
  item,
  permissions,
  adminUrl,
  pathname,
  checkActiveMenu,
  checkActiveMenuChild,
  isCollapsed,
}) => {
  const IconComponent = getIconComponent(item.icon);
  const isDefaultChecked = item.link
    .split("|")
    .some((link) => adminUrl + link === pathname);

  const [submenuPosition, setSubmenuPosition] = React.useState({
    top: 0,
    left: 0,
  });
  const [showSubmenu, setShowSubmenu] = React.useState(false);
  const menuRef = React.useRef(null);
  const hoverTimeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (isCollapsed && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const submenuWidth = 200; // min width của submenu
      const windowWidth = window.innerWidth;

      let left = rect.right + 8;
      let top = rect.top;

      // Kiểm tra nếu submenu vượt quá right edge
      if (left + submenuWidth > windowWidth) {
        left = rect.left - submenuWidth - 8; // Hiển thị bên trái
      }

      // Kiểm tra nếu submenu vượt quá bottom edge
      const submenuHeight = Math.min(
        item.items?.length * 40 + 60,
        window.innerHeight * 0.8
      );
      if (top + submenuHeight > window.innerHeight) {
        top = Math.max(10, window.innerHeight - submenuHeight - 10);
      } else {
        top -= 15;
      }

      setSubmenuPosition({ top, left });
      setShowSubmenu(true);
    }
  };

  const handleMouseLeave = () => {
    // Add delay before hiding submenu
    hoverTimeoutRef.current = setTimeout(() => {
      setShowSubmenu(false);
    }, 200); // 200ms delay
  };

  const handleSubmenuMouseEnter = () => {
    // Clear timeout when mouse enters submenu
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowSubmenu(true);
  };

  const handleSubmenuMouseLeave = () => {
    // Hide submenu when mouse leaves submenu
    hoverTimeoutRef.current = setTimeout(() => {
      setShowSubmenu(false);
    }, 200); // 200ms delay
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (isCollapsed) {
    return (
      <li className="relative group">
        <div
          ref={menuRef}
          className={`
          flex items-center justify-center w-12 h-12 mx-auto rounded-xl
          transition-all duration-200 cursor-pointer
          hover:bg-gray-100 hover:shadow-md
          ${checkActiveMenu(item.link, true)}
        `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <IconComponent className="w-6 h-6 text-gray-600" />
        </div>

        {/* Fixed Submenu Dropdown */}
        {showSubmenu && (
          <div
            className="fixed min-w-[200px] max-w-[300px] bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] py-2"
            style={{
              top: `${submenuPosition.top}px`,
              left: `${submenuPosition.left}px`,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onMouseEnter={handleSubmenuMouseEnter}
            onMouseLeave={handleSubmenuMouseLeave}
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <span className="font-medium text-gray-900 text-sm">
                {item.name}
              </span>
            </div>

            {/* Submenu Items */}
            <div className="py-1">
              {item.items
                ?.filter((childItem) =>
                  hasChildPermission(childItem, permissions)
                )
                .map((itemChild) => (
                  <LinkCustom
                    key={itemChild.id}
                    href={adminUrl + itemChild.link}
                    className={`
                      block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50
                      transition-all duration-200
                      ${
                        checkActiveMenu(itemChild.link)
                          ? "text-blue-600 bg-blue-50"
                          : ""
                      }
                    `}
                    onClick={() => setShowSubmenu(false)} // Hide submenu when clicking a link
                  >
                    {itemChild.name}
                  </LinkCustom>
                ))}
            </div>
          </div>
        )}
      </li>
    );
  }

  return (
    <li className="relative">
      <MenuItemHeader
        item={item}
        IconComponent={IconComponent}
        checkActiveMenu={checkActiveMenu}
        isParent={true}
      />

      <SubMenuContainer itemId={item.id} isDefaultChecked={isDefaultChecked}>
        {item.items
          ?.filter((childItem) => hasChildPermission(childItem, permissions))
          .map((itemChild) => (
            <SubMenuItem
              key={itemChild.id}
              item={itemChild}
              permissions={permissions}
              adminUrl={adminUrl}
              checkActiveMenu={checkActiveMenu}
              checkActiveMenuChild={checkActiveMenuChild}
            />
          ))}
      </SubMenuContainer>
    </li>
  );
};

// Single Menu Item Component
const SingleMenuItem = ({
  item,
  permissions,
  adminUrl,
  checkActiveMenu,
  isCollapsed,
}) => {
  const IconComponent = getIconComponent(item.icon);
  const href = item.link === "" ? adminUrl.slice(0, -1) : adminUrl + item.link;

  const [tooltipPosition, setTooltipPosition] = React.useState({
    top: 0,
    left: 0,
  });
  const [showTooltip, setShowTooltip] = React.useState(false);
  const menuRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (isCollapsed && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const tooltipWidth = 150; // Approximate tooltip width
      const windowWidth = window.innerWidth;

      let left = rect.right + 12; // 12px gap from menu item
      let top = rect.top + rect.height / 2; // Center vertically

      // Check if tooltip would exceed right edge of screen
      if (left + tooltipWidth > windowWidth) {
        left = rect.left - tooltipWidth - 12; // Show on left side
      }

      // Ensure tooltip doesn't go above screen
      if (top < 10) {
        top = 10;
      }
      // Ensure tooltip doesn't go below screen
      const tooltipHeight = 40; // Approximate tooltip height
      if (top + tooltipHeight > window.innerHeight) {
        top = window.innerHeight - tooltipHeight - 10;
      }
      {
        top -= 15;
      }

      setTooltipPosition({ top, left });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  if (isCollapsed) {
    return (
      <li className="relative group">
        <div
          ref={menuRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <LinkCustom
            href={href}
            className={`
              flex items-center justify-center w-12 h-12 mx-auto rounded-xl
              transition-all duration-200 hover:shadow-md hover:scale-105
              ${checkActiveMenu(item.link) || "hover:bg-gray-100"}
            `}
          >
            <IconComponent className="w-6 h-6 text-gray-600" />
          </LinkCustom>

          {/* Fixed Tooltip */}
          {showTooltip && (
            <div
              className="fixed px-3 py-2 bg-gray-900 text-white text-sm rounded-lg z-[9999] whitespace-nowrap pointer-events-none"
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                transform: "translateY(-50%)",
              }}
            >
              {item.name}
              <div
                className="absolute top-1/2 w-2 h-2 bg-gray-900 rotate-45 transform -translate-y-1/2"
                style={{
                  left:
                    tooltipPosition.left >
                    (menuRef.current?.getBoundingClientRect().right || 0)
                      ? "-4px"
                      : "calc(100% - 4px)",
                }}
              ></div>
            </div>
          )}
        </div>
      </li>
    );
  }

  return (
    <li
      className={`
      group rounded-xl transition-all duration-200 hover:shadow-sm
      ${checkActiveMenu(item.link)}
    `}
    >
      <div className="flex items-center justify-between">
        <LinkCustom
          href={href}
          className="flex items-center gap-3 px-4 py-3 flex-1 rounded-xl transition-all duration-200 hover:bg-gray-50"
        >
          <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            {item.name}
          </span>
        </LinkCustom>

        {item.add && permissions.includes(`${item.link}.create`) && (
          <AddButton href={adminUrl + item.add} />
        )}
      </div>
    </li>
  );
};

// Menu Item Header Component
const MenuItemHeader = ({ item, IconComponent, checkActiveMenu, isParent }) => {
  return (
    <div className="menu-sidebar">
      <label
        className={`
          flex justify-between items-center w-full px-4 py-3 cursor-pointer 
          rounded-xl transition-all duration-200 hover:bg-gray-50 hover:shadow-sm group
          ${checkActiveMenu(item.link, isParent)}
        `}
        htmlFor={`menu-sidebar-${item.id}`}
      >
        <span className="flex items-center gap-3">
          <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            {item.name}
          </span>
        </span>
        <ChevronIcon />
      </label>
    </div>
  );
};

// Sub Menu Container Component
const SubMenuContainer = ({ itemId, isDefaultChecked, children }) => {
  return (
    <div className="menu-sub ml-4">
      <input
        type="checkbox"
        id={`menu-sidebar-${itemId}`}
        defaultChecked={isDefaultChecked}
        className="peer sr-only"
      />
      <ul className="space-y-1 mt-2 peer-checked:block hidden pl-4 border-gray-100">
        {children}
      </ul>
    </div>
  );
};

// Sub Menu Item Component
const SubMenuItem = ({
  item,
  permissions,
  adminUrl,
  checkActiveMenu,
  checkActiveMenuChild,
}) => {
  return (
    <li
      className={`
      group rounded-lg transition-all duration-200 hover:bg-gray-50
      ${checkActiveMenu(item.link)}
    `}
    >
      <div className="flex items-center justify-between">
        <LinkCustom
          href={adminUrl + item.link}
          className={`
            block py-2.5 px-4 flex-1 rounded-lg transition-all duration-200
            relative before:content-[''] before:absolute before:w-2 before:h-2 
            before:rounded-full before:top-1/2 before:left-[-12px] before:-translate-y-1/2
            before:transition-all before:duration-200 text-sm text-gray-600 hover:text-gray-900
            ${checkActiveMenuChild(item.link)}
          `}
        >
          {item.name}
        </LinkCustom>

        {item.add && permissions.includes(`${item.link}.create`) && (
          <AddButton href={adminUrl + item.add} />
        )}
      </div>
    </li>
  );
};

// Add Button Component
const AddButton = ({ href }) => {
  return (
    <LinkCustom
      href={href}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group mr-2"
      title="Thêm mới"
    >
      <svg
        className="w-4 h-4 transition-transform group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </LinkCustom>
  );
};

// Chevron Icon Component
const ChevronIcon = () => {
  return (
    <svg
      className="w-4 h-4 text-gray-400 transition-transform duration-200 peer-checked:rotate-180"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

// Utility Functions
const getIconComponent = (iconName) => {
  if (typeof iconSVG === "object" && iconName && iconSVG[iconName]) {
    return iconSVG[iconName];
  }
  return <></>;
};

const hasChildPermission = (item, permissions) => {
  const lists = item.link.split("|");
  return lists.some((link) => permissions.includes(`${link}.read`));
};

export default Sidebar;
