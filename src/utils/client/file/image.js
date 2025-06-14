/**
 * Lấy URL hình ảnh đã tối ưu (avif, webp hoặc original)
 * @param {string|Object} imageData - Dữ liệu hình ảnh
 * @param {boolean} optimal - Có sử dụng format tối ưu không (default: true)
 * @returns {string} - URL hình ảnh
 */
export const showImageUrl = (imageData, optimal = true) => {
  const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL?.replace(/\/?$/, "/");
  if (!imageData) return "/next.svg";

  // Helper function to safely parse JSON
  const safeJsonParse = (jsonString) => {
    if (!jsonString || typeof jsonString !== 'string') return null;
    
    try {
      // Clean up common JSON formatting issues
      let cleanJson = jsonString.trim();
      
      // Replace single quotes with double quotes if needed
      if (cleanJson.includes("'") && !cleanJson.includes('"')) {
        cleanJson = cleanJson.replace(/'/g, '"');
      }
      
      // Handle mixed quotes - replace single quotes that aren't inside double quotes
      cleanJson = cleanJson.replace(/(?<!\\)'(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g, '"');
      
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return null;
    }
  };

  // Helper function to get optimized URL from file_info
  const getOptimizedUrl = (fileInfo, originalUrl) => {
    if (!fileInfo || !optimal) return originalUrl;
    
    const parsed = safeJsonParse(fileInfo);
    if (!parsed) return originalUrl;
    
    // Priority: avif > webp > original
    if (parsed.avif) return parsed.avif;
    if (parsed.webp) return parsed.webp;
    return originalUrl;
  };

  // Helper function to construct full URL
  const constructUrl = (url) => {
    if (!url) return "/next.svg";
    
    // Clean up backslashes
    const cleanUrl = url.replace(/\\/g, "/");
    
    if (cleanUrl.startsWith("/")) {
      return baseUrl + cleanUrl.slice(1);
    }
    return baseUrl + cleanUrl;
  };

  // Case 1: imageData is a string and is a full URL
  if (typeof imageData === "string") {
    if (/^(https?:|blob:|\/\/|\/)/.test(imageData)) {
      return imageData;
    }
    
    // Case 2: imageData is a string starting with "/"
    if (imageData.startsWith("/")) {
      return baseUrl + imageData.slice(1);
    }
    
    // Case 3: Try to parse imageData as JSON string
    const parsed = safeJsonParse(imageData);
    if (parsed?.url) {
      const optimizedUrl = getOptimizedUrl(parsed.file_info, parsed.url);
      return constructUrl(optimizedUrl);
    }
  }

  // Case 4: imageData is an object with url property
  if (typeof imageData === "object" && imageData?.url) {
    const optimizedUrl = getOptimizedUrl(imageData.file_info, imageData.url);
    return constructUrl(optimizedUrl);
  }

  // Default fallback
  return "/next.svg";
};