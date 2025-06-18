import { httpClient } from "../../http";

export const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Upload file theo chunks để hỗ trợ file lớn
 * @param {File} file - File cần upload
 * @param {Object} obj - Object chứa file_id và media_id
 * @param {Function} onProgress - Callback khi progress thay đổi
 * @param {Function} onSetMedia - Callback khi upload hoàn thành
 * @param {string} token - Authorization token
 * @returns {Promise<boolean|Object>} - true nếu thành công, response object nếu lỗi
 */
export const uploadFileResumable = async (
  file,
  obj,
  onProgress,
  onSetMedia
) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("chunkIndex", chunkIndex);
    formData.append("totalChunks", totalChunks);

    if (obj.media_id) {
      formData.append("media_id", obj.media_id);
    }
    formData.append("file_id", obj.file_id);

    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/upload-file",
      {},
      formData,
      "POST"
    );

    if (response.status == 200 || response.status == 201) {
      onProgress(); // Gọi callback cập nhật tiến độ
      if (response.status == 201) {
        onSetMedia(response.data); // Gọi callback khi hoàn thành
      }
    } else {
      return response;
    }
  }

  return true; // Upload hoàn tất
};

/**
 * Convert bytes thành format dễ đọc (B, KB, MB, GB, etc.)
 * @param {number} bytes - Số bytes cần convert
 * @param {number} decimals - Số chữ số thập phân (default: 1)
 * @returns {string} - Chuỗi đã format (vd: "1.5 MB")
 */
export const convertSize = (bytes, decimals = 1) => {
  if (!+bytes) return "0 B";

  const k = 1024;
  let dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i < 3) {
    dm = 0; // Không hiển thị decimal cho B, KB, MB
  }

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
