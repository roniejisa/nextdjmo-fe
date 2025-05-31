/**
 * Debounce function để tránh gọi function quá nhiều lần
 * @param {Function} func - Function cần debounce
 * @param {number} delay - Thời gian delay (ms), default: 500ms
 * @returns {Function} - Function đã được debounce
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 * debouncedSearch("test"); // Chỉ gọi sau 300ms không có call mới
 */
export const debounce = (func, delay = 500) => {
  let timeout;
  
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};