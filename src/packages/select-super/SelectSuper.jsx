import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// Main SearchFieldSelector Component
export const SearchFieldSelector = ({
  fields = [],
  selectedField = "",
  selectedFields = [], // For multiple selection
  onChange,
  onSearch,
  onResult, // Callback with search results for custom rendering
  placeholder = "Chọn trường",
  searchPlaceholder = "Tìm kiếm...",
  noResultsText = "Không tìm thấy kết quả",
  disabled = false,
  className = "",
  dropdownClassName = "",
  loading = false,
  multiple = false, // Enable multiple selection
  maxHeight = "16rem", // max-h-64
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFields, setFilteredFields] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const textFields = useMemo(
    () =>
      fields.filter((field) => field.type === "text" && field.name !== "_id"),
    [fields]
  );

  // Filter fields based on search term (for local data)
  useEffect(() => {
    if (!onResult) {
      // Local filtering when no onResult callback
      if (!searchTerm) {
        setFilteredFields(textFields);
      } else {
        const filtered = textFields.filter(
          (field) =>
            field.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFields(filtered);
      }
    }
  }, [searchTerm, textFields, onResult]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setSearchResults(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (field) => {
      if (multiple) {
        const currentSelected = Array.isArray(selectedFields)
          ? selectedFields
          : [];
        const isAlreadySelected = currentSelected.some(
          (f) => f.name === field.name
        );

        let newSelected;
        if (isAlreadySelected) {
          newSelected = currentSelected.filter((f) => f.name !== field.name);
        } else {
          newSelected = [...currentSelected, field];
        }

        if (onChange) {
          onChange(
            newSelected.map((f) => f.name),
            newSelected
          );
        }
      } else {
        if (onChange) {
          onChange(field.name, field);
        }
        setIsOpen(false);
        setSearchTerm("");
        setSearchResults(null);
      }
    },
    [onChange, multiple, selectedFields]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const term = e.target.value;
      setSearchTerm(term);

      // Debounce search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        if (onResult && term) {
          // Server search when onResult callback is provided
          setIsSearching(true);
          try {
            const results = await onSearch?.(term);
            setSearchResults(results);
          } catch (error) {
            console.error("Search error:", error);
            setSearchResults(null);
          } finally {
            setIsSearching(false);
          }
        } else if (onSearch && !onResult) {
          // Call onSearch but don't expect results for custom handling
          onSearch(term);
        }
      }, 300);
    },
    [onSearch, onResult]
  );

  // Get selected field labels for display
  const getSelectedDisplay = useMemo(() => {
    if (multiple) {
      const selected = Array.isArray(selectedFields) ? selectedFields : [];
      if (selected.length === 0) return placeholder;
      if (selected.length === 1) return selected[0].label;
      return `${selected.length} mục đã chọn`;
    } else {
      const found = textFields.find((f) => f.name === selectedField);
      return found?.label || placeholder;
    }
  }, [textFields, selectedField, selectedFields, placeholder, multiple]);

  // Get current selection values
  const getCurrentValues = useMemo(() => {
    if (multiple) {
      return Array.isArray(selectedFields)
        ? selectedFields.map((f) => f.name)
        : [];
    } else {
      return selectedField;
    }
  }, [selectedField, selectedFields, multiple]);

  // Check if field is selected
  const isFieldSelected = useCallback(
    (field) => {
      if (multiple) {
        const currentSelected = Array.isArray(selectedFields)
          ? selectedFields
          : [];
        return currentSelected.some((f) => f.name === field.name);
      } else {
        return field.name === selectedField;
      }
    },
    [selectedField, selectedFields, multiple]
  );

  // Clear all selections
  const clearSelections = useCallback(() => {
    if (multiple) {
      if (onChange) onChange([], []);
    } else {
      if (onChange) onChange("", null);
    }
  }, [onChange, multiple]);

  // SVG Icons
  const ChevronDownIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );

  const CheckIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );

  const SearchIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );

  const XIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const LoadingIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Get data to render in dropdown
  const getDropdownData = () => {
    if (onResult && searchResults) {
      return searchResults;
    } else if (onResult && searchTerm && !searchResults && !isSearching) {
      return [];
    } else {
      return filteredFields;
    }
  };

  const dropdownData = getDropdownData();
  const showLoading = loading || isSearching;
  return (
    <div className={`relative`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
            ${
              className
                ? className
                : "w-full min-w-[100px] h-12 px-4 border-2 border-gray-200 bg-white rounded-xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            } group relative
          transition-all duration-300 ease-out
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${
            isOpen
              ? "border-blue-400 shadow-lg shadow-blue-100/50 scale-[1.02]"
              : ""
          }
        `}
      >
        <div className="flex items-center justify-between w-full">
          <span
            className={`
            text-sm font-medium truncate transition-colors duration-200
            ${
              (multiple ? selectedFields?.length > 0 : selectedField)
                ? "text-gray-900"
                : "text-gray-500"
            }
          `}
          >
            {getSelectedDisplay}
          </span>

          <div className="flex items-center space-x-2">
            {/* Clear button for multiple selection */}
            {multiple && selectedFields?.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelections();
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <XIcon className="w-3 h-3 text-gray-400" />
              </button>
            )}

            {showLoading && (
              <LoadingIcon className="w-4 h-4 animate-spin text-blue-500" />
            )}
            <ChevronDownIcon
              className={`
                w-5 h-5 text-gray-400 group-hover:text-blue-500
                transition-all duration-300 ease-out
                ${isOpen ? "rotate-180 text-blue-500" : ""}
              `}
            />
          </div>
        </div>

        <div
          className={`
          absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/0 to-blue-50/30
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          pointer-events-none
        `}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-2 
            bg-white/95 backdrop-blur-xl border border-gray-200/50
            rounded-2xl shadow-2xl shadow-gray-900/10
            z-50 overflow-hidden
            animate-in slide-in-from-top-2 duration-200
            ${dropdownClassName}
          `}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100/80 bg-gray-50/30">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="
                  w-full pl-4 pr-4 py-2 
                  bg-white/80 border border-gray-200/50 rounded-xl
                  focus:outline-none focus:ring-3 focus:ring-blue-100/80 focus:border-blue-300
                  placeholder-gray-400 text-sm font-medium
                  transition-all duration-200
                  backdrop-blur-sm
                "
              />
            </div>
          </div>

          {/* Multiple selection summary */}
          {multiple && selectedFields?.length > 0 && (
            <div className="px-4 py-2 bg-blue-50/50 border-b border-blue-100/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-700">
                  {selectedFields.length} mục đã chọn
                </span>
                <button
                  type="button"
                  onClick={clearSelections}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedFields.slice(0, 3).map((field) => (
                  <span
                    key={field.name}
                    className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium"
                  >
                    {field.label}
                  </span>
                ))}
                {selectedFields.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                    +{selectedFields.length - 3} khác
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className={`overflow-y-auto hover:scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
            style={{ maxHeight }}
          >
            {showLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingIcon className="w-6 h-6 animate-spin text-blue-500 mr-3" />
                <span className="text-sm font-medium text-gray-600">
                  Đang tải...
                </span>
              </div>
            ) : dropdownData.length > 0 ? (
              <div className="py-2">
                {onResult && searchResults
                  ? // Custom rendering with onResult callback
                    onResult(searchResults, {
                      searchTerm,
                      onSelect: handleSelect,
                      isSelected: isFieldSelected,
                      multiple,
                      selectedValues: getCurrentValues,
                    })
                  : // Default rendering
                    dropdownData.map((field, index) => {
                      const isSelected = isFieldSelected(field);
                      return (
                        <button
                          key={field.name || index}
                          type="button"
                          onClick={() => handleSelect(field)}
                          className={`
                          group w-full px-4 py-3 text-left
                          flex items-center justify-between
                          transition-all duration-200 ease-out
                          ${
                            isSelected
                              ? "bg-blue-50 text-blue-700 border-r-3 border-blue-400"
                              : "text-gray-700 hover:bg-gray-50/80 hover:translate-x-1"
                          }
                        `}
                        >
                          <div className="flex items-center space-x-3">
                            {multiple && (
                              <div
                                className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300 group-hover:border-blue-300"
                              }
                            `}
                              >
                                {isSelected && (
                                  <CheckIcon className="w-3 h-3 text-white" />
                                )}
                              </div>
                            )}
                            <div
                              className={`
                            w-2 h-2 rounded-full transition-all duration-200
                            ${
                              isSelected
                                ? "bg-blue-400"
                                : "bg-gray-300 group-hover:bg-blue-300"
                            }
                          `}
                            />
                            <span
                              className={`
                            text-sm font-medium transition-colors duration-200
                            ${
                              isSelected
                                ? "text-blue-700"
                                : "text-gray-700 group-hover:text-gray-900"
                            }
                          `}
                            >
                              {field.label}
                            </span>
                          </div>

                          {!multiple && isSelected && (
                            <CheckIcon className="w-4 h-4 text-blue-600 animate-in zoom-in-50 duration-200" />
                          )}
                        </button>
                      );
                    })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <SearchIcon className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500 px-1 text-center mb-1">
                  {noResultsText}
                </p>
                <p className="text-xs text-gray-400 mt-1">Thử từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Hook for server integration
export const useSearchFieldSelector = (apiUrl, options = {}) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFields = useCallback(
    async (searchTerm = "") => {
      if (!apiUrl) return null;

      setLoading(true);
      setError(null);

      try {
        const url = new URL(apiUrl);
        if (searchTerm) {
          url.searchParams.append("search", searchTerm);
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          ...(options.fetchOptions || {}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const transformedFields = options.transform
          ? options.transform(data)
          : data;

        if (!searchTerm) {
          // Only set fields state for initial load
          setFields(Array.isArray(transformedFields) ? transformedFields : []);
        }

        return Array.isArray(transformedFields) ? transformedFields : [];
      } catch (err) {
        setError(err.message);
        if (options.onError) {
          options.onError(err);
        }
        return null;
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      apiUrl,
      options.headers,
      options.fetchOptions,
      options.transform,
      options.onError,
    ]
  );

  useEffect(() => {
    searchFields();
  }, [searchFields]);

  return {
    fields,
    loading,
    error,
    searchFields,
    refetch: () => searchFields(),
  };
};
