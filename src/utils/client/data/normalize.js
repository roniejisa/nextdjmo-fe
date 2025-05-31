/**
 * Chuẩn hóa dữ liệu để tất cả objects có cùng structure
 * Hữu ích khi làm việc với APIs trả về data không đồng nhất
 * @param {Object} data - Object chứa data cần chuẩn hóa
 * @returns {Object} - Data đã được chuẩn hóa
 * @example
 * const data = {
 *   vietnam: { population: 97000000, capital: { name: "Hanoi" } },
 *   thailand: { population: 70000000 } // Thiếu capital
 * };
 * const normalized = normalizeData(data);
 * // Kết quả: thailand sẽ có capital.name = 0
 */
export const normalizeData = (data) => {
  // Tìm tất cả các attributes có thể có từ tất cả objects
  const allAttributes = new Set();
  
  Object.values(data).forEach((item) => {
    const extractKeys = (obj, prefix = "") => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && obj[key] !== null) {
          extractKeys(obj[key], `${prefix}${key}.`);
        } else {
          allAttributes.add(`${prefix}${key}`);
        }
      }
    };
    extractKeys(item);
  });

  // Chuẩn hóa từng object để có đầy đủ attributes
  const normalized = {};
  Object.entries(data).forEach(([itemKey, itemData]) => {
    const normalizedItem = {};
    
    allAttributes.forEach((attribute) => {
      const keys = attribute.split(".");
      let value = itemData;
      
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      
      normalizedItem[attribute] = value ?? 0; // Gán 0 nếu không tồn tại
    });
    
    normalized[itemKey] = normalizedItem;
  });
  
  return normalized;
};

/**
 * Flatten nested object thành object phẳng với dot notation
 * @param {Object} obj - Object cần flatten
 * @param {string} prefix - Prefix cho keys (internal use)
 * @returns {Object} - Object đã flatten
 * @example
 * flattenObject({ user: { name: "John", address: { city: "NYC" } } })
 * // Returns: { "user.name": "John", "user.address.city": "NYC" }
 */
export const flattenObject = (obj, prefix = "") => {
  const flattened = {};
  
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else {
      flattened[newKey] = obj[key];
    }
  }
  
  return flattened;
};

/**
 * Unflatten object từ dot notation về nested object
 * @param {Object} obj - Object với dot notation keys
 * @returns {Object} - Nested object
 * @example
 * unflattenObject({ "user.name": "John", "user.address.city": "NYC" })
 * // Returns: { user: { name: "John", address: { city: "NYC" } } }
 */
export const unflattenObject = (obj) => {
  const result = {};
  
  for (const key in obj) {
    const keys = key.split(".");
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = obj[key];
  }
  
  return result;
};

/**
 * Deep merge nhiều objects
 * @param {...Object} objects - Các objects cần merge
 * @returns {Object} - Object đã merge
 * @example
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } })
 * // Returns: { a: 1, b: { c: 2, d: 3 } }
 */
export const deepMerge = (...objects) => {
  const result = {};
  
  objects.forEach(obj => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && obj[key] !== null) {
        result[key] = deepMerge(result[key] || {}, obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  });
  
  return result;
};