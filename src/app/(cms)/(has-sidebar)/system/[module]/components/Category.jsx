"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Custom Hook for Category Logic
const useCategoryLogic = (field) => {
  const router = useRouterCustom();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [selected, setSelected] = useState(() => {
    return searchParams.get(field.name) || null;
  });
  
  const [isInitialRender, setIsInitialRender] = useState(true);

  const handleSelectCategory = (categoryId) => {
    setSelected((prev) => (prev === categoryId ? null : categoryId));
  };

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    const newSearchParams = new URLSearchParams(Object.fromEntries(searchParams));
    
    if (selected) {
      newSearchParams.set(field.name, selected);
    } else {
      newSearchParams.delete(field.name);
    }

    const paramsObject = Object.fromEntries(newSearchParams);
    router.pushWithQuery(pathname, paramsObject);
  }, [selected, field.name, searchParams, pathname, router, isInitialRender]);

  return { selected, handleSelectCategory };
};

// Custom Hook for Dropdown Logic
const useCategoryDropdownLogic = (fieldName) => {
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
      left: rect.left + scrollX
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
        const dropdown = document.getElementById(`dropdown-${fieldName}`);
        if (dropdown && !dropdown.contains(event.target)) {
          setShowDropdown(false);
        }
      }
    };

    const handleScroll = () => setShowDropdown(false);
    const handleResize = () => setShowDropdown(false);

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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
    setShowDropdown
  };
};

// CategoryItem Component
const CategoryItem = ({ category, field, isSelected, onClick, className = "" }) => {
  const baseClasses = "inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer border-2 select-none";
  
  const selectedClasses = isSelected
    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105"
    : "text-gray-700 border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md hover:scale-105";

  return (
    <span
      className={`${baseClasses} ${selectedClasses} ${className}`}
      onClick={onClick}
    >
      <span className="mr-2"></span>
      {category[field.module_label]}
    </span>
  );
};

// MoreButton Component
const MoreCategoryButton = ({ count, buttonRef, onMouseEnter, onMouseLeave, onClick }) => {
  return (
    <div
      ref={buttonRef}
      className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-2 border-dashed border-gray-300 text-gray-600 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 hover:scale-105"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span className="mr-1">+</span>
      <span>{count}</span>
      <span className="ml-1 text-xs opacity-70">danh mục</span>
    </div>
  );
};

// CategoryDropdown Component
const CategoryDropdown = ({ 
  id, 
  position, 
  categories, 
  field,
  selected, 
  onSelectCategory, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  return (
    <div
      id={id}
      className="fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 shadow-sm"></div>

      {/* Dropdown Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-[450px] backdrop-blur-sm">
        {/* Categories Grid */}
        <div className="flex gap-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              category={category}
              field={field}
              isSelected={selected === category[field.module_id]}
              onClick={() => onSelectCategory(category[field.module_id])}
              className="text-xs justify-start"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// EmptyState Component
const CategoryEmptyState = ({ fieldLabel }) => {
  return (
    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">
          {fieldLabel} chưa được chọn
        </p>
      </div>
    </div>
  );
};

// Main Category Component
const Category = ({ value, field, item }) => {
  const { selected, handleSelectCategory } = useCategoryLogic(field);
  const {
    showDropdown,
    dropdownPosition,
    buttonRef,
    handleShowDropdown,
    handleHideDropdown,
    handleKeepDropdown,
    setShowDropdown
  } = useCategoryDropdownLogic(field.name);

  // Early return for empty state
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <CategoryEmptyState fieldLabel={field.label} />;
  }

  // Prepare categories data
  const selectedIndex = value.findIndex(
    (category) => category[field.module_id] === selected
  );
  const firstCategoryIndex = selectedIndex !== -1 ? selectedIndex : 0;
  const firstCategory = value[firstCategoryIndex];
  const remainingCategories = value.filter(
    (category) => category[field.module_id] !== firstCategory[field.module_id]
  );

  return (
    <div className="space-y-4">
      {/* Categories Container */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Primary Category */}
        <CategoryItem
          category={firstCategory}
          field={field}
          isSelected={selected === firstCategory[field.module_id]}
          onClick={() => handleSelectCategory(firstCategory[field.module_id])}
        />

        {/* More Button */}
        {remainingCategories.length > 0 && (
          <MoreCategoryButton
            count={remainingCategories.length}
            buttonRef={buttonRef}
            onMouseEnter={handleShowDropdown}
            onMouseLeave={handleHideDropdown}
            onClick={handleShowDropdown}
          />
        )}
      </div>

      {/* Dropdown Portal */}
      {showDropdown && remainingCategories.length > 0 && (
        <CategoryDropdown
          id={`dropdown-${field.name}`}
          position={dropdownPosition}
          categories={remainingCategories}
          field={field}
          selected={selected}
          onSelectCategory={(categoryId) => {
            handleSelectCategory(categoryId);
            setShowDropdown(false); // Immediately close dropdown after selection
          }}
          onMouseEnter={handleKeepDropdown}
          onMouseLeave={handleHideDropdown}
        />
      )}
    </div>
  );
};

export default Category;