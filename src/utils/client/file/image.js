/**
 * Lấy URL hình ảnh đã tối ưu (avif, webp hoặc original)
 * @param {string|Object} imageData - Dữ liệu hình ảnh
 * @param {boolean} optimal - Có sử dụng format tối ưu không (default: true)
 * @returns {string} - URL hình ảnh
 */
export const showImageUrl = (imageData, optimal = true) => {
  const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL?.replace(/\/?$/, "/");
  if (!imageData) return "/next.svg";

  // Nếu `url` là string và là URL đầy đủ (http, https, blob, hoặc absolute path)
  if (/^(https?:|blob:|\/\/|\/)/.test(imageData)) return imageData;

  // Nếu `url` là string và bắt đầu bằng "/"
  if (typeof imageData === "string" && imageData.startsWith("/"))
    return baseUrl + imageData.slice(1);

  // Nếu `url` là object và có `url` bên trong
  if (typeof imageData === "object" && imageData?.url) {
    if (imageData.file_info && optimal) {
      const parsed = JSON.parse(imageData.file_info);
      if (parsed.avif) {
        imageData.url = parsed.avif;
      } else if (parsed.webp) {
        imageData.url = parsed.webp;
      }
    }
    return imageData.url.startsWith("/")
      ? baseUrl + imageData.url.slice(1).replace(/\\/g, "/")
      : baseUrl + imageData.url.replace(/\\/g, "/");
  }

  // Thử parse `url` như JSON
  try {
    let parsed = JSON.parse(imageData);
    if (parsed.file_info && optimal) {
      parsed =
        typeof imageData?.file_info === "string"
          ? JSON.parse(imageData?.file_info.replaceAll("'", '"'))
          : parsed;
      if (typeof parsed.avif != "undefined") {
        imageData.url = parsed.avif;
      } else if (typeof parsed.webp != "undefined") {
        imageData.url = parsed.webp;
      }
    }
    if (parsed?.url) {
      return parsed.url.startsWith("/")
        ? baseUrl + parsed.url.slice(1).replace(/\\/g, "/")
        : baseUrl + parsed.url.replace(/\\/g, "/");
    }
  } catch {
    // Bỏ qua lỗi nếu JSON không hợp lệ
  }

  // Trả về mặc định nếu không khớp điều kiện nào
  return "/next.svg";
};