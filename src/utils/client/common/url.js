/**
 * Tạo query string từ search params và form data
 * @param {URLSearchParams} searchParams - Search params hiện tại
 * @param {FormData|Object} data - Data từ form hoặc object
 * @param {Object} defaultParams - Params mặc định (default: {page: 1, limit: 20})
 * @returns {string} - Query string (vd: "?page=1&limit=20&search=test")
 */
export const createQueryString = (
  searchParams, 
  data, 
  defaultParams = { page: 1, limit: 20 }
) => {
  let newSearchParams = new URLSearchParams(searchParams);
  
  // Xử lý data từ form hoặc object
  const entries = data instanceof FormData ? [...data] : Object.entries(data);
  
  for (const [key, value] of entries) {
    if (value === "" || value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
  }
  
  // Thêm các tham số mặc định
  for (const [key, value] of Object.entries(defaultParams)) {
    if (!newSearchParams.has(key)) {
      newSearchParams.set(key, value);
    }
  }
  
  return newSearchParams.toString() ? `?${newSearchParams.toString()}` : "";
};