/**
 * Chuyển đổi chuỗi thành slug URL-friendly (hỗ trợ tiếng Việt)
 * @param {string} value - Chuỗi cần chuyển đổi
 * @returns {string} - Slug đã format
 * @example toSlug("Xin chào Việt Nam") => "xin-chao-viet-nam"
 */
export const toSlug = (value) => {
  return value
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/đ/g, "d") // Xử lý chữ "đ"
    .normalize("NFD") // Chuẩn hóa ký tự Unicode (hỗ trợ tiếng Việt)
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự không hợp lệ
    .trim() // Xóa khoảng trắng thừa
    .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
};

/**
 * Tạo ID ngẫu nhiên chứa chữ cái
 * @param {number} length - Độ dài ID cần tạo
 * @returns {string} - ID ngẫu nhiên
 * @example makeId(8) => "aBcDeFgH"
 */
export const makeId = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  
  return result;
};

/**
 * Chỉnh viết hoa chữ cái đầu và viết thường chữ cái sau
 * @param {string} sentence - String cần format lại
 * @param {Object} options - Tùy chọn format
 * @param {boolean} options.preserveCase - Giữ nguyên case của các ký tự sau (default: false)
 * @param {boolean} options.trimWhitespace - Loại bỏ khoảng trắng đầu cuối (default: true)
 * @param {boolean} options.handleMultipleWords - Xử lý nhiều từ (default: false)
 * @returns {string} Chuỗi đã được format
 */
export function cfl(sentence, options = {}) {
  const {
    preserveCase = false,
    trimWhitespace = true,
    handleMultipleWords = false
  } = options;
  
  // Kiểm tra input hợp lệ
  if (!sentence || typeof sentence !== 'string') {
    return "";
  }
  
  // Trim whitespace nếu cần
  const trimmed = trimWhitespace ? sentence.trim() : sentence;
  
  if (trimmed.length === 0) {
    return "";
  }
  
  // Xử lý nhiều từ
  if (handleMultipleWords) {
    return trimmed.split(' ')
      .filter(word => word.length > 0) // Loại bỏ khoảng trắng thừa
      .map(word => formatSingleWord(word, preserveCase))
      .join(' ');
  }
  
  return formatSingleWord(trimmed, preserveCase);
}

/**
 * Format một từ đơn
 * @param {string} word 
 * @param {boolean} preserveCase 
 * @returns {string}
 */
function formatSingleWord(word, preserveCase) {
  const firstChar = word.charAt(0);
  const restChars = word.slice(1);
  
  return firstChar.toUpperCase() + (preserveCase ? restChars : restChars.toLowerCase());
}

// Các hàm tiện ích bổ sung
export const capitalizeFirst = (str) => cfl(str);
export const capitalizeWords = (str) => cfl(str, { handleMultipleWords: true });
export const capitalizePreserve = (str) => cfl(str, { preserveCase: true });

// Hàm xử lý title case (viết hoa từ có ý nghĩa)
export function toTitleCase(str, options = {}) {
  const { 
    skipWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'],
    alwaysCapitalize = ['I'],
    forceFirstLast = true 
  } = options;
  
  if (!str || typeof str !== 'string') return "";
  
  const words = str.trim().toLowerCase().split(/\s+/);
  
  return words.map((word, index) => {
    const isFirst = index === 0;
    const isLast = index === words.length - 1;
    const shouldCapitalize = 
      alwaysCapitalize.includes(word) ||
      (forceFirstLast && (isFirst || isLast)) ||
      !skipWords.includes(word);
    
    return shouldCapitalize ? cfl(word) : word;
  }).join(' ');
}