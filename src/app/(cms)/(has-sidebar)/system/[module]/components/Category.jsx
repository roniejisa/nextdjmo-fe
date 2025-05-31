"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const Category = ({ value, field, item }) => {
  const router = useRouterCustom();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selected, setSelected] = useState(() => {
    if (searchParams.get(field.name)) {
      return searchParams.get(field.name);
    } else {
      return null;
    }
  });
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const handleShowDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      setDropdownPosition({
        top: rect.bottom + scrollY + 8, // 8px gap
        left: rect.left + scrollX
      });
    }
    setShowDropdown(true);
  };

  const handleHideDropdown = () => {
    setShowDropdown(false);
  };

  const handleChooseCategory = (_id) => {
    setSelected((prev) => {
      if (prev === _id) {
        return null;
      }
      return _id;
    });
    setShowDropdown(false); // Đóng dropdown sau khi chọn
  };

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        const dropdown = document.getElementById(`dropdown-${field.name}`);
        if (dropdown && !dropdown.contains(event.target)) {
          setShowDropdown(false);
        }
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleHideDropdown);
      window.addEventListener('resize', handleHideDropdown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleHideDropdown);
      window.removeEventListener('resize', handleHideDropdown);
    };
  }, [showDropdown, field.name]);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    let newSeachParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
    });
    let url;
    if (selected) {
      newSeachParams.set(field.name, selected);
    } else {
      newSeachParams.delete(field.name);
    }
    const paramsObject = Object.fromEntries(newSeachParams);
    router.pushWithQuery(pathname, paramsObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (value && Array.isArray(value) && value.length > 0) {
    let indexFirst = value.findIndex(
      (category) => category[field.module_id] === selected
    );
    if (indexFirst < 0) {
      indexFirst = 0;
    }
    const firstTag = value[indexFirst];
    const remainingItems = value.filter(
      (item) => item[field.module_id] !== firstTag[field.module_id]
    );

    return (
      <div className="flex flex-wrap gap-2">
        {/* First tag */}
        <span
          className={`border border-outline px-3 py-2 transition-all duration-200 cursor-pointer rounded-lg text-sm font-medium ${
            selected === firstTag[field.module_id]
              ? "bg-outline text-white shadow-md"
              : "text-outline hover:bg-outline hover:text-white hover:shadow-md"
          }`}
          onClick={() => handleChooseCategory(firstTag[field.module_id])}
        >
          {firstTag[field.module_label]}
        </span>

        {/* More button with dropdown */}
        {remainingItems.length > 0 && (
          <>
            <div 
              ref={buttonRef}
              className="border border-outline text-outline px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition-all duration-200"
              onMouseEnter={handleShowDropdown}
              onMouseLeave={handleHideDropdown}
              onClick={handleShowDropdown}
            >
              +{remainingItems.length}
            </div>
            
            {/* Fixed Dropdown Portal */}
            {showDropdown && (
              <div 
                id={`dropdown-${field.name}`}
                className="fixed z-[9999] transition-all duration-200"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`
                }}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={handleHideDropdown}
              >
                {/* Arrow pointing up */}
                <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                
                {/* Dropdown content */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-[280px] max-w-[350px]">
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {remainingItems.map((item, index) => (
                      <span
                        key={index}
                        className={`border border-outline px-3 py-2 transition-all duration-200 rounded-lg cursor-pointer text-sm font-medium ${
                          selected === item[field.module_id]
                            ? "bg-outline text-white shadow-md"
                            : "text-outline hover:bg-outline hover:text-white hover:shadow-md"
                        }`}
                        onClick={() => handleChooseCategory(item[field.module_id])}
                      >
                        {item[field.module_label]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="text-gray-500 text-sm italic">
        {field.label} chưa được chọn
      </div>
    );
  }
};

export default Category;