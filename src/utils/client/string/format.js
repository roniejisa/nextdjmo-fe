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
    handleMultipleWords = false,
  } = options;

  // Kiểm tra input hợp lệ
  if (!sentence || typeof sentence !== "string") {
    return "";
  }

  // Trim whitespace nếu cần
  const trimmed = trimWhitespace ? sentence.trim() : sentence;

  if (trimmed.length === 0) {
    return "";
  }

  // Xử lý nhiều từ
  if (handleMultipleWords) {
    return trimmed
      .split(" ")
      .filter((word) => word.length > 0) // Loại bỏ khoảng trắng thừa
      .map((word) => formatSingleWord(word, preserveCase))
      .join(" ");
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

  return (
    firstChar.toUpperCase() +
    (preserveCase ? restChars : restChars.toLowerCase())
  );
}

// Các hàm tiện ích bổ sung
export const capitalizeFirst = (str) => cfl(str);
export const capitalizeWords = (str) => cfl(str, { handleMultipleWords: true });
export const capitalizePreserve = (str) => cfl(str, { preserveCase: true });

// Hàm xử lý title case (viết hoa từ có ý nghĩa)
export function toTitleCase(str, options = {}) {
  const {
    skipWords = [
      "a",
      "an",
      "and",
      "as",
      "at",
      "but",
      "by",
      "for",
      "if",
      "in",
      "nor",
      "of",
      "on",
      "or",
      "so",
      "the",
      "to",
      "up",
      "yet",
    ],
    alwaysCapitalize = ["I"],
    forceFirstLast = true,
  } = options;

  if (!str || typeof str !== "string") return "";

  const words = str.trim().toLowerCase().split(/\s+/);

  return words
    .map((word, index) => {
      const isFirst = index === 0;
      const isLast = index === words.length - 1;
      const shouldCapitalize =
        alwaysCapitalize.includes(word) ||
        (forceFirstLast && (isFirst || isLast)) ||
        !skipWords.includes(word);

      return shouldCapitalize ? cfl(word) : word;
    })
    .join(" ");
}

export const formatKey = (value, options = {}, segment = "_") => {
  const {
    preserveCase = true, // Giữ nguyên chữ hoa/thường
    removeAccents = true, // Loại bỏ dấu tiếng Việt
    allowNumbers = true, // Cho phép số
    allowUnderscore = true, // Cho phép dấu gạch dưới
    trimSegments = true, // Loại bỏ segment thừa ở đầu/cuối
    preserveSlash = false, // Bảo toàn dấu / cho URL path
  } = options;

  if (!value || typeof value !== "string") return "";

  let result = value;

  // Bước 1: Loại bỏ dấu tiếng Việt nếu cần
  if (removeAccents) {
    const accentsMap = {
      à: "a", á: "a", ạ: "a", ả: "a", ã: "a", â: "a", ầ: "a", ấ: "a", 
      ậ: "a", ẩ: "a", ẫ: "a", ă: "a", ằ: "a", ắ: "a", ặ: "a", ẳ: "a", ẵ: "a",
      è: "e", é: "e", ẹ: "e", ẻ: "e", ẽ: "e", ê: "e", ề: "e", ế: "e",
      ệ: "e", ể: "e", ễ: "e",
      ì: "i", í: "i", ị: "i", ỉ: "i", ĩ: "i",
      ò: "o", ó: "o", ọ: "o", ỏ: "o", õ: "o", ô: "o", ồ: "o", ố: "o",
      ộ: "o", ổ: "o", ỗ: "o", ơ: "o", ờ: "o", ớ: "o", ợ: "o", ở: "o", ỡ: "o",
      ù: "u", ú: "u", ụ: "u", ủ: "u", ũ: "u", ư: "u", ừ: "u", ứ: "u",
      ự: "u", ử: "u", ữ: "u",
      ỳ: "y", ý: "y", ỵ: "y", ỷ: "y", ỹ: "y",
      đ: "d", Đ: "D",
      // Chữ hoa
      À: "A", Á: "A", Ạ: "A", Ả: "A", Ã: "A", Â: "A", Ầ: "A", Ấ: "A",
      Ậ: "A", Ẩ: "A", Ẫ: "A", Ă: "A", Ằ: "A", Ắ: "A", Ặ: "A", Ẳ: "A", Ẵ: "A",
      È: "E", É: "E", Ẹ: "E", Ẻ: "E", Ẽ: "E", Ê: "E", Ề: "E", Ế: "E",
      Ệ: "E", Ể: "E", Ễ: "E",
      Ì: "I", Í: "I", Ị: "I", Ỉ: "I", Ĩ: "I",
      Ò: "O", Ó: "O", Ọ: "O", Ỏ: "O", Õ: "O", Ô: "O", Ồ: "O", Ố: "O",
      Ộ: "O", Ổ: "O", Ỗ: "O", Ơ: "O", Ờ: "O", Ớ: "O", Ợ: "O", Ở: "O", Ỡ: "O",
      Ù: "U", Ú: "U", Ụ: "U", Ủ: "U", Ũ: "U", Ư: "U", Ừ: "U", Ứ: "U",
      Ự: "U", Ử: "U", Ữ: "U",
      Ỳ: "Y", Ý: "Y", Ỵ: "Y", Ỷ: "Y", Ỹ: "Y",
    };

    result = result.replace(
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]/g,
      (char) => accentsMap[char] || char
    );
  }

  // Bước 2: Nếu preserveSlash = true, xử lý từng phần của URL path riêng biệt
  if (preserveSlash && result.includes('/')) {
    const parts = result.split('/');
    const processedParts = parts.map(part => {
      if (!part) return part; // Giữ nguyên phần rỗng (như ở đầu URL)
      
      // Xử lý từng phần giống như logic cũ
      let processedPart = part;
      
      // Thay thế khoảng trắng và ký tự đặc biệt bằng segment
      processedPart = processedPart.replace(/\s+/g, segment);
      
      // Tạo pattern cho phép
      let allowedPattern = "a-zA-Z";
      if (allowNumbers) allowedPattern += "0-9";
      if (allowUnderscore && segment !== "_") allowedPattern += "_";
      
      // Escape segment nếu là ký tự đặc biệt trong regex
      const escapedSegment = segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      allowedPattern += escapedSegment;
      
      // Loại bỏ ký tự không được phép
      processedPart = processedPart.replace(new RegExp(`[^${allowedPattern}]`, "g"), "");
      
      // Chuyển thành chữ thường nếu cần
      if (!preserveCase) {
        processedPart = processedPart.toLowerCase();
      }
      
      // Loại bỏ segment thừa
      if (trimSegments && segment) {
        const segmentRegex = new RegExp(`\\${escapedSegment}+`, "g");
        processedPart = processedPart
          .replace(segmentRegex, segment) // Thay nhiều segment liên tiếp thành 1
          .replace(
            new RegExp(`^\\${escapedSegment}+|\\${escapedSegment}+$`, "g"),
            ""
          ); // Loại bỏ segment ở đầu/cuối
      }
      
      return processedPart;
    });
    
    result = processedParts.join('/');
  } else {
    // Xử lý như cũ nếu không preserveSlash hoặc không có dấu /
    
    // Bước 2: Thay thế khoảng trắng và ký tự đặc biệt bằng segment
    result = result.replace(/\s+/g, segment);

    // Bước 3: Tạo pattern cho phép
    let allowedPattern = "a-zA-Z";
    if (allowNumbers) allowedPattern += "0-9";
    if (allowUnderscore && segment !== "_") allowedPattern += "_";

    // Escape segment nếu là ký tự đặc biệt trong regex
    const escapedSegment = segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    allowedPattern += escapedSegment;

    // Bước 4: Loại bỏ ký tự không được phép
    result = result.replace(new RegExp(`[^${allowedPattern}]`, "g"), "");

    // Bước 5: Chuyển thành chữ thường nếu cần
    if (!preserveCase) {
      result = result.toLowerCase();
    }

    // Bước 6: Loại bỏ segment thừa
    if (trimSegments && segment) {
      const segmentRegex = new RegExp(`\\${escapedSegment}+`, "g");
      result = result
        .replace(segmentRegex, segment) // Thay nhiều segment liên tiếp thành 1
        .replace(
          new RegExp(`^\\${escapedSegment}+|\\${escapedSegment}+$`, "g"),
          ""
        ); // Loại bỏ segment ở đầu/cuối
    }
  }

  return result;
};