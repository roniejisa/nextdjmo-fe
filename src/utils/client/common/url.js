/**
 * Tạo query string từ search params và form data
 * @param {URLSearchParams} searchParams - Search params hiện tại
 * @param {FormData|Object} data - Data từ form hoặc object
 * @param {Object} defaultParams - Params mặc định (default: {page: 1, limit: 20})
 * @param {Bool} returnUrlSearchParam - Trả về dữ liệu URLSearchParams
 * @returns {string} - Query string (vd: "?page=1&limit=20&search=test")
 */
export const createQueryString = (
  searchParams,
  data,
  defaultParams = { page: 1, limit: 20 },
  returnUrlSearchParam = false
) => {
  let newSearchParams = new URLSearchParams(searchParams);

  // Xử lý data từ form hoặc object
  let entries = data
  if(!Array.isArray(entries)){
    entries = data instanceof FormData ? [...data] : Object.entries(data);
  }

  for (const [key, value] of entries) {
    // Kiểm tra key hợp lệ (không phải số hoặc ký tự lạ)
    if (typeof key !== "string" || key.trim() === "" || /^\d+$/.test(key)) {
      console.warn(`Skipping invalid key: "${key}"`);
      continue;
    }

    // Xóa các giá trị rỗng hoặc không hợp lệ
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      newSearchParams.delete(key);
    } else {
      // Đảm bảo value là string và trim whitespace
      const cleanValue = String(value).trim();
      if (cleanValue) {
        newSearchParams.set(key, cleanValue);
      } else {
        newSearchParams.delete(key);
      }
    }
  }

  // Xóa các tham số không hợp lệ từ searchParams gốc
  const keysToDelete = [];
  for (const [key] of newSearchParams.entries()) {
    if (/^\d+$/.test(key) || key.includes("%") || key.trim() === "") {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach((key) => newSearchParams.delete(key));

  // Thêm các tham số mặc định
  for (const [key, value] of Object.entries(defaultParams)) {
    if (newSearchParams.has(key)) {
      newSearchParams.set(key, String(value));
    }
  }
  if (returnUrlSearchParam) return newSearchParams
  const result = newSearchParams.toString();
  return result ? `?${result}` : "";
};
