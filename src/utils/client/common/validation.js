/**
 * Kiểm tra email hợp lệ
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} - true nếu email hợp lệ
 * @example
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid.email") // false
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} - true nếu số điện thoại hợp lệ
 * @example
 * isValidPhone("0987654321") // true
 * isValidPhone("+84987654321") // true
 * isValidPhone("123") // false
 */
export function isValidPhone(phone) {
  const phoneRegex = /^(?:\+84|0)\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Kiểm tra URL hợp lệ
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} - true nếu URL hợp lệ
 * @example
 * isValidUrl("https://example.com") // true
 * isValidUrl("not-a-url") // false
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Kiểm tra mật khẩu mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số)
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {boolean} - true nếu mật khẩu đủ mạnh
 * @example
 * isStrongPassword("Password123") // true
 * isStrongPassword("weak") // false
 */
export function isStrongPassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

/**
 * Kiểm tra số CMND/CCCD Việt Nam hợp lệ
 * @param {string} id - Số CMND/CCCD cần kiểm tra
 * @returns {boolean} - true nếu hợp lệ
 * @example
 * isValidVietnameseId("123456789") // true (CMND 9 số)
 * isValidVietnameseId("123456789012") // true (CCCD 12 số)
 */
export function isValidVietnameseId(id) {
  const idRegex = /^(\d{9}|\d{12})$/; // CMND 9 số hoặc CCCD 12 số
  return idRegex.test(id);
}

/**
 * Kiểm tra mã số thuế doanh nghiệp Việt Nam
 * @param {string} taxCode - Mã số thuế cần kiểm tra
 * @returns {boolean} - true nếu hợp lệ
 * @example
 * isValidTaxCode("0123456789") // true (10 số)
 * isValidTaxCode("0123456789012") // true (13 số)
 */
export function isValidTaxCode(taxCode) {
  const taxCodeRegex = /^(\d{10}|\d{13})$/; // 10 hoặc 13 số
  return taxCodeRegex.test(taxCode);
}

/**
 * Kiểm tra chuỗi chỉ chứa ký tự tiếng Việt và khoảng trắng
 * @param {string} text - Chuỗi cần kiểm tra
 * @returns {boolean} - true nếu chỉ chứa tiếng Việt
 * @example
 * isVietnameseText("Nguyễn Văn A") // true
 * isVietnameseText("John Smith") // false
 */
export function isVietnameseText(text) {
  const vietnameseRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯÁẮẰẲẴẶÂẤẦẨẪẬÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ\s]+$/;
  return vietnameseRegex.test(text);
}

/**
 * Kiểm tra số có phải là số nguyên dương
 * @param {any} value - Giá trị cần kiểm tra
 * @returns {boolean} - true nếu là số nguyên dương
 * @example
 * isPositiveInteger(5) // true
 * isPositiveInteger(-1) // false
 * isPositiveInteger("abc") // false
 */
export function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

/**
 * Kiểm tra chuỗi có độ dài trong khoảng cho phép
 * @param {string} text - Chuỗi cần kiểm tra
 * @param {number} min - Độ dài tối thiểu
 * @param {number} max - Độ dài tối đa
 * @returns {boolean} - true nếu độ dài hợp lệ
 * @example
 * isValidLength("Hello", 3, 10) // true
 * isValidLength("Hi", 5, 10) // false
 */
export function isValidLength(text, min, max) {
  const length = text?.length || 0;
  return length >= min && length <= max;
}

/**
 * Kiểm tra giá trị có nằm trong danh sách cho phép
 * @param {any} value - Giá trị cần kiểm tra
 * @param {Array} allowedValues - Danh sách giá trị cho phép
 * @returns {boolean} - true nếu hợp lệ
 * @example
 * isInAllowedList("admin", ["admin", "user", "guest"]) // true
 * isInAllowedList("hacker", ["admin", "user", "guest"]) // false
 */
export function isInAllowedList(value, allowedValues) {
  return allowedValues.includes(value);
}