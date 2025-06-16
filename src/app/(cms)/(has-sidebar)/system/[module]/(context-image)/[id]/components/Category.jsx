"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Tag,
  Plus,
  ChevronDown,
  Check,
  ChevronRight,
  Folder,
  FolderOpen,
  ArrowLeft,
  Home,
  ChevronLeft,
} from "lucide-react";
import { httpClient } from "@/utils/http";

// Real API client - thay thế mock httpClient
const fetcher = async (url) => {
  try {
    const { status, data, message } = await httpClient(url);
    if (!status) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Custom hook để thay thế SWR với pagination support
const useApiCall = (key, fetcher, shouldFetch = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fetcher && key && shouldFetch) {
      setIsLoading(true);
      setError(null);

      fetcher()
        .then((result) => {
          setData(result);
          setError(null);
        })
        .catch((err) => {
          setError(err);
          setData(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, shouldFetch]);

  // Function để trigger refetch
  const mutate = () => {
    if (fetcher && key) {
      setIsLoading(true);
      fetcher()
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false));
    }
  };

  return { data, error, isLoading, mutate };
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="p-2 rounded-lg bg-white/40 hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`dots-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              currentPage === page
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white/40 hover:bg-white/60 text-gray-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="p-2 rounded-lg bg-white/40 hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const CategoryModal = ({
  isOpen,
  onClose,
  field,
  onSelect,
  selectedCategories,
  onRemove,
  apiBaseUrl = "http://localhost:8000",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Reset page khi search hoặc breadcrumb thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, breadcrumb]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm.length >= 1) {
        setBreadcrumb([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build API URL với pagination
  const apiUrl = useMemo(() => {
    let baseUrl = `${field.module}/field-type?limit=${pageSize}&page=${currentPage}`;
    console.log(field);
    
    if (field.module_id && field.module_label) {
      baseUrl += `&fields=${field.module_id},${field.module_label}`;
    }

    if (field.type) {
      baseUrl += `&field_type=${field.type}`;
    }

    if (field.module_parent_id) {
      baseUrl += `&field_parent_id=${field.module_parent_id}`;
    }

    if (debouncedSearch) {
      baseUrl += `&${field.module_label}=${encodeURIComponent(
        debouncedSearch
      )}`;
    }

    return baseUrl;
  }, [field, debouncedSearch, currentPage, pageSize]);

  const isSearchMode = debouncedSearch.length >= 1;

  // Fetch main categories hoặc search results
  const { data, error, isLoading } = useApiCall(
    isOpen && (isSearchMode || breadcrumb.length === 0)
      ? `category-search-${debouncedSearch}-${breadcrumb.length}-${currentPage}`
      : null,
    () => fetcher(`${apiBaseUrl}/${apiUrl}`),
    isOpen && (isSearchMode || breadcrumb.length === 0)
  );

  // Fetch children cho current level với pagination
  const currentParentId =
    breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1]._id : null;

  const childrenApiUrl = useMemo(() => {
    if (!currentParentId) return "";
    
    return `${field.module}/field-type?${field.module_parent_id}=${currentParentId}&limit=${pageSize}&page=${currentPage}&field_type=${field.type}&field_parent_id=${field.module_parent_id}&fields=${field.module_id},${field.module_label}`;
  }, [currentParentId, field, currentPage, pageSize]);

  const { data: childrenData, isLoading: childrenLoading } = useApiCall(
    currentParentId && !isSearchMode ? `children-${currentParentId}-${currentPage}` : null,
    () => fetcher(`${apiBaseUrl}/${childrenApiUrl}`),
    currentParentId && !isSearchMode
  );

  // Xử lý response data và pagination info
  const { categories, totalPages, total } = useMemo(() => {
    let responseData;
    
    if (isSearchMode) {
      responseData = data;
    } else if (currentParentId) {
      responseData = childrenData;
    } else {
      responseData = data;
    }

    if (!responseData) {
      return { categories: [], totalPages: 1, total: 0 };
    }

    // Xử lý response structure
    const items = responseData.items || responseData.data?.items || responseData || [];
    const totalCount = responseData.total || responseData.data?.total || items.length;
    const calculatedTotalPages = Math.ceil(totalCount / pageSize);

    return {
      categories: Array.isArray(items) ? items : [],
      totalPages: calculatedTotalPages,
      total: totalCount
    };
  }, [isSearchMode, data, childrenData, currentParentId, pageSize]);

  const selectedIds = selectedCategories.map((cat) => cat[field.module_id]);

  // Helper function để tạo path với đầy đủ module_id
  const createCategoryPath = (category) => {
    const fullPath = [...breadcrumb, category];
    return fullPath.map((c) => ({
      id: c._id || c.id,
      name: c[field.module_label] || c.name,
      module_id: c[field.module_id] // Thêm module_id vào path
    }));
  };

  // Helper function để lấy tất cả module_id từ path (cấp cha đến cấp con)
  const getAllModuleIdsFromPath = (category) => {
    const path = createCategoryPath(category);
    return path.map(item => item.module_id);
  };

  // Helper function để kiểm tra xem category có phải là parent của selected categories không
  const isParentOfSelected = (categoryId) => {
    return selectedCategories.some((selected) => {
      return selected.path && selected.path.some((pathItem) => pathItem.id === categoryId);
    });
  };

  // Helper function để lấy tất cả children IDs (recursive)
  const getAllChildrenIds = (categoryId, allCategories = categories) => {
    const children = allCategories.filter(cat => 
      cat[field.module_parent_id] === categoryId
    );
    
    let childrenIds = children.map(child => child[field.module_id]);
    
    // Recursively get children of children
    children.forEach(child => {
      if (child.has_category === "1") {
        childrenIds = [...childrenIds, ...getAllChildrenIds(child[field.module_id], allCategories)];
      }
    });
    
    return childrenIds;
  };

  // Handle checkbox selection
  const handleCheckboxChange = (category, isChecked) => {
    const categoryId = category[field.module_id];
    
    if (isChecked) {
      // Thêm category vào selected với đầy đủ thông tin
      const categoryData = {
        [field.module_id]: categoryId,
        [field.module_label]: category[field.module_label],
        has_category: category.has_category,
        path: createCategoryPath(category),
        // Thêm array chứa tất cả module_id từ cấp cha đến cấp con
        all_module_ids: getAllModuleIdsFromPath(category)
      };
      onSelect(categoryData);
    } else {
      // Xóa category và tất cả children của nó
      const childrenIds = category.has_category === "1" 
        ? getAllChildrenIds(categoryId)
        : [];
      
      // Xóa category hiện tại và tất cả children
      const idsToRemove = [categoryId, ...childrenIds];
      idsToRemove.forEach(id => onRemove(id));
    }
  };

  // Handle category navigation (click vào folder icon hoặc tên)
  const handleCategoryNavigate = (category) => {
    if (isSearchMode && category.has_category === "1") {
      setSearchTerm("");
      setDebouncedSearch("");
      setBreadcrumb([category]);
      return;
    }

    if (!isSearchMode && category.has_category === "1") {
      setBreadcrumb((prev) => [...prev, category]);
      return;
    }
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setBreadcrumb([]);
    } else {
      setBreadcrumb((prev) => prev.slice(0, index + 1));
    }
  };

  const handleGoBack = () => {
    setBreadcrumb((prev) => prev.slice(0, -1));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setBreadcrumb([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chọn {field.label}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {isSearchMode
                  ? `Kết quả tìm kiếm (${total} kết quả) - Trang ${currentPage}/${totalPages}`
                  : `Duyệt theo danh mục (${total} mục) - Trang ${currentPage}/${totalPages}`}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 bg-gradient-to-b from-white/50 to-transparent backdrop-blur-sm border-b border-white/10">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Nhập ít nhất 1 ký tự để tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200 placeholder-gray-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        {!isSearchMode && breadcrumb.length > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => handleBreadcrumbClick(-1)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/40 text-gray-600 hover:text-gray-800 transition-all duration-200"
              >
                <Home size={14} />
                <span>Tất cả</span>
              </button>
              {breadcrumb.map((item, index) => (
                <React.Fragment key={item._id || item.id}>
                  <ChevronRight size={14} className="text-gray-400" />
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbClick(index)}
                    className="px-2 py-1 rounded-lg hover:bg-white/40 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium"
                  >
                    {item[field.module_label] || item.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(80vh - 400px)" }}>
          {/* Back button */}
          {!isSearchMode && breadcrumb.length > 0 && (
            <div className="p-4 pb-0">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-200 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft size={16} />
                <span>Quay lại</span>
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading || childrenLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải trang {currentPage}...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Có lỗi xảy ra khi tải dữ liệu</p>
              <p className="text-sm mt-2 text-gray-500">{error.message}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              {isSearchMode ? (
                <>
                  <Search className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">Không tìm thấy danh mục nào</p>
                </>
              ) : breadcrumb.length === 0 ? (
                <>
                  <Folder className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">
                    Nhập từ khóa để bắt đầu tìm kiếm hoặc chọn danh mục
                  </p>
                </>
              ) : (
                <>
                  <Folder className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">Không có danh mục con</p>
                </>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-2 mb-4">
                {categories.map((category) => {
                  const categoryId = category[field.module_id] || category.id;
                  const categoryLabel =
                    category[field.module_label] || category.name;
                  const isSelected = selectedIds.includes(categoryId);
                  const hasChildren =
                    category.has_category === "1" || category.hasChildren;
                  const isParent = isParentOfSelected(categoryId);

                  return (
                    <div
                      key={categoryId}
                      className={`group relative rounded-xl backdrop-blur-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-green-500/20 border border-green-500/30"
                          : isParent
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : "bg-white/40 border border-white/20 hover:bg-white/60 hover:border-white/40"
                      }`}
                    >
                      <div className="flex items-center">
                        {/* Checkbox */}
                        <div className="p-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                          </label>
                        </div>

                        {/* Category Info - Click để navigate nếu có children */}
                        <div 
                          className="flex-1 flex items-center gap-3 py-4 pr-4"
                          onClick={hasChildren ? () => handleCategoryNavigate(category) : undefined}
                          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
                        >
                          {hasChildren ? (
                            <FolderOpen size={18} className="text-blue-500" />
                          ) : (
                            <Folder size={18} className="text-gray-500" />
                          )}
                          <span
                            className={`font-medium ${
                              isSelected 
                                ? "text-green-700" 
                                : isParent
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {categoryLabel}
                          </span>
                          
                          <div className="ml-auto flex items-center gap-2">
                            {isSelected && (
                              <Check size={16} className="text-green-600" />
                            )}
                            {isParent && !isSelected && (
                              <span className="text-xs bg-blue-500/20 text-blue-700 px-2 py-1 rounded-full">
                                Có con đã chọn
                              </span>
                            )}
                            {hasChildren && (
                              <ChevronRight
                                size={16}
                                className="text-gray-400 group-hover:text-gray-600"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading || childrenLoading}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-md border-t border-white/20 p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Đã chọn:{" "}
              <span className="font-semibold text-blue-600">
                {selectedCategories.length}
              </span>{" "}
              danh mục
              {isSearchMode && (
                <span className="ml-2 text-orange-600">
                  (Chế độ tìm kiếm)
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Category = ({
  field,
  defaultValue,
  onChange,
  apiBaseUrl = "http://localhost:8000",
}) => {
  console.log(field)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(field.value);
  const [jsonValue, setJsonValue] = useState(JSON.stringify(field.value.map(item=>item[field.module_id])));

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed =
          typeof defaultValue === "string"
            ? JSON.parse(defaultValue)
            : defaultValue;
        if (Array.isArray(parsed)) {
          setSelectedCategories(parsed);
        }
      } catch (error) {
        console.error("Error parsing default value:", error);
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    // Thu thập tất cả module_id từ các category đã chọn
    const allModuleIds = [];
    
    selectedCategories.forEach(cat => {
      if (cat.all_module_ids && Array.isArray(cat.all_module_ids)) {
        // Nếu có all_module_ids thì lấy tất cả (từ cấp cha đến cấp con)
        allModuleIds.push(...cat.all_module_ids);
      } else {
        // Fallback: chỉ lấy module_id của chính nó
        allModuleIds.push(cat[field.module_id]);
      }
    });

    // Loại bỏ duplicate
    const uniqueModuleIds = [...new Set(allModuleIds)];
    
    const jsonString = JSON.stringify(uniqueModuleIds);
    setJsonValue(jsonString);
    if (onChange) {
      onChange(jsonString);
    }
  }, [selectedCategories, onChange, field.module_id]);

  const handleCategorySelect = (category) => {
    setSelectedCategories((prev) => {
      const exists = prev.find(
        (cat) => cat[field.module_id] === category[field.module_id]
      );
      if (exists) {
        return prev;
      }
      return [...prev, category];
    });
  };

  const handleCategoryRemove = (categoryId) => {
    setSelectedCategories((prev) => {
      // Tìm category bị xóa
      const categoryToRemove = prev.find(cat => cat[field.module_id] === categoryId);
      
      if (categoryToRemove) {
        // Xóa category và tất cả children của nó
        return prev.filter(cat => {
          // Giữ lại nếu không phải là category bị xóa
          if (cat[field.module_id] === categoryId) {
            return false;
          }
          
          // Kiểm tra xem category này có phải là con của category bị xóa không
          if (cat.path && categoryToRemove.path) {
            const isChild = cat.path.some(pathItem => 
              pathItem.id === categoryToRemove[field.module_id]
            );
            return !isChild;
          }
          
          return true;
        });
      }
      
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      {/* Selected Categories Tags */}
      {selectedCategories.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Danh mục đã chọn:
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category[field.module_id]}
                className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 text-blue-800 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Tag size={14} />
                <span className="font-medium">
                  {category.path
                    ? category.path.map((p) => p.name).join(" > ")
                    : category[field.module_label]}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCategoryRemove(category[field.module_id])
                  }
                  className="ml-1 p-1 rounded-full hover:bg-white/20 text-blue-600 hover:text-blue-800 transition-all duration-200"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-xl hover:from-blue-500/20 hover:to-purple-500/20 hover:border-white/50 transition-all duration-200 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Plus size={18} className="text-blue-500" />
        <span className="font-medium">Chọn {field.label}</span>
        <ChevronDown
          size={16}
          className="ml-auto text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
        />
      </button>

      {/* Hidden input for form submission */}
      <input type="hidden" name={field.name} value={jsonValue} />

      {/* Debug JSON Display - chỉ hiện trong development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Output (All Module IDs - Including Parent Hierarchy):
          </h4>
          <pre className="text-xs text-gray-600 overflow-auto max-h-32">
            {jsonValue}
          </pre>
          <h4 className="text-sm font-medium text-gray-700 mb-2 mt-4">
            Selected Categories (Full Data):
          </h4>
          <pre className="text-xs text-gray-600 overflow-auto max-h-32">
            {JSON.stringify(selectedCategories, null, 2)}
          </pre>
        </div>
      )}

      {/* Category Selection Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        field={field}
        onSelect={handleCategorySelect}
        selectedCategories={selectedCategories}
        onRemove={handleCategoryRemove}
        apiBaseUrl={apiBaseUrl}
      />
    </div>
  );
};

export default Category;