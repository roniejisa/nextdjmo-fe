"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

// Custom Hook for Tag Logic
const useTagLogic = (field) => {
  const router = useRouterCustom();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selected, setSelected] = useState(() => {
    return searchParams.get(field.name) || null;
  });

  // Đồng bộ state với URL params khi route thay đổi
  useEffect(() => {
    const currentSelected = searchParams.get(field.name) || null;
    setSelected(currentSelected);
  }, [searchParams, field.name]);

  const handleSelectTag = (label) => {
    const newSelected = selected === label ? null : label;
    setSelected(newSelected);

    // Update URL immediately with pagination reset
    const newSearchParams = new URLSearchParams(
      Object.fromEntries(searchParams)
    );

    if (newSelected) {
      newSearchParams.set(field.name, newSelected);
    } else {
      newSearchParams.delete(field.name);
    }

    // Reset pagination when filter changes
    newSearchParams.delete('page');
    newSearchParams.delete('limit');
    
    const paramsObject = Object.fromEntries(newSearchParams);
    router.pushWithQuery(pathname, paramsObject);
  };

  return { selected, handleSelectTag };
};

// Custom Hook for Dropdown Logic
const useDropdownLogic = (fieldName) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    setDropdownPosition({
      top: rect.bottom + scrollY + 12,
      left: rect.left + scrollX,
    });
  };

  const handleShowDropdown = () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    calculateDropdownPosition();
    setShowDropdown(true);
  };

  const handleHideDropdown = () => {
    // Add delay before hiding to prevent flickering
    hideTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  const handleKeepDropdown = () => {
    // Cancel hide timeout when mouse enters dropdown
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        const dropdown = document.getElementById(`dropdown-tag-${fieldName}`);
        if (dropdown && !dropdown.contains(event.target)) {
          setShowDropdown(false);
        }
      }
    };

    const handleScroll = () => setShowDropdown(false);
    const handleResize = () => setShowDropdown(false);

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      // Clean up timeout on unmount
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showDropdown, fieldName]);

  return {
    showDropdown,
    dropdownPosition,
    buttonRef,
    handleShowDropdown,
    handleHideDropdown,
    handleKeepDropdown,
    setShowDropdown,
  };
};

// TagItem Component
const TagItem = ({ label, isSelected, onClick, className = "" }) => {
  const baseClasses =
    "inline-flex items-center px-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer border-2 select-none";

  const selectedClasses = isSelected
    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
    : "text-gray-700 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md hover:scale-105";

  return (
    <span
      className={`${baseClasses} ${selectedClasses} ${className}`}
      onClick={onClick}
    >
      {label}
    </span>
  );
};

// MoreButton Component
const MoreButton = ({
  count,
  buttonRef,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <div
      ref={buttonRef}
      className="inline-flex items-center px-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-2 border-dashed border-gray-300 text-gray-600 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:scale-105"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span className="mr-1">+</span>
      <span>{count}</span>
    </div>
  );
};

// Dropdown Component
const Dropdown = ({
  id,
  position,
  items,
  selected,
  onSelectItem,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      id={id}
      className="fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 shadow-sm"></div>

      {/* Dropdown Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-2 max-w-[400px] backdrop-blur-sm">
        <div className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <TagItem
              key={index}
              label={item}
              isSelected={selected === item}
              onClick={() => onSelectItem(item)}
              className="text-xs"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// EmptyState Component
const EmptyState = ({ fieldLabel }) => {
  return (
    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">
          Không có {fieldLabel}
        </p>
      </div>
    </div>
  );
};

// Main Tag Component
const Tag = ({ value, field }) => {
  const { selected, handleSelectTag } = useTagLogic(field);
  const {
    showDropdown,
    dropdownPosition,
    buttonRef,
    handleShowDropdown,
    handleHideDropdown,
    handleKeepDropdown,
    setShowDropdown,
  } = useDropdownLogic(field.name);

  // Early return for empty state
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <EmptyState fieldLabel={field.label} />;
  }

  // Prepare tags data
  const selectedIndex = value.findIndex((item) => item === selected);
  const firstTagIndex = selectedIndex !== -1 ? selectedIndex : 0;
  const firstTag = value[firstTagIndex];
  const remainingItems = value.filter((item) => item !== firstTag);

  return (
    <div className="space-y-2">
      {/* Tags Container */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Primary Tag */}
        <TagItem
          label={firstTag}
          isSelected={selected === firstTag}
          onClick={() => handleSelectTag(firstTag)}
        />

        {/* More Button */}
        {remainingItems.length > 0 && (
          <MoreButton
            count={remainingItems.length}
            buttonRef={buttonRef}
            onMouseEnter={handleShowDropdown}
            onMouseLeave={handleHideDropdown}
            onClick={handleShowDropdown}
          />
        )}
      </div>

      {/* Dropdown Portal */}
      {showDropdown && remainingItems.length > 0 && (
        <Dropdown
          id={`dropdown-tag-${field.name}`}
          position={dropdownPosition}
          items={remainingItems}
          selected={selected}
          onSelectItem={(item) => {
            handleSelectTag(item);
            setShowDropdown(false); // Immediately close dropdown after selection
          }}
          onMouseEnter={handleKeepDropdown}
          onMouseLeave={handleHideDropdown}
        />
      )}
    </div>
  );
};

export default Tag;