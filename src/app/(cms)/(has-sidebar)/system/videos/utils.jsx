import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

const CHUNK_SIZE = 1024 * 1024 * 5;
export const updateVideo = async (file, onProgress) => {
  const token = await getToken();
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
    formData.append("file_id", "upload");
    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "videos/upload-file",
      {
        Authorization: `Bearer ${token}`,
      },
      formData,
      "POST"
    );
    onProgress(chunkIndex + 1); // Gọi callback cập nhật tiến độ
    if (response.status == 201) {
      return response;
    }
  }
  return true; // Upload hoàn tất
};

