import { httpClient } from "../http";

export const CHUNK_SIZE = 2 * 1024 * 1024; // 5MB

export const uploadFileResumable = async (
  file,
  obj,
  onProgress,
  onSetMedia,
  token
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
    // try {
    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/upload-file",
      {
        Authorization: `Bearer ${token}`,
      },
      formData,
      "POST"
    );
    if (response.status == 200 || response.status == 201) {
      // const percentage = Math.round(((chunkIndex + 1) / totalFiles) * 100);
      onProgress(); // Gọi callback cập nhật tiến độ
      if (response.status == 201) {
        onSetMedia(response.data); // Gọi callback cập nhật tiến độ
      }
    } else {
      return response;
    }
    // } catch (error) {
    //     console.error("Error uploading chunk:", error);
    //     return false;
    // }
  }

  return true; // Upload hoàn tất
};

export const convertSize = (bytes, decimals = 1) => {
  if (!+bytes) return "0 B";
  const k = 1024;
  let dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i < 3) {
    dm = 0;
  }
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const showImageUrl = (imageData, optimal = true) => {
  const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL?.replace(/\/?$/, "/");
  if (!imageData) return "/next.svg";

  // Nếu `url` là string và là URL đầy đủ
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

export const randomBgColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const chooseColorIndex = (index) => {
  if (index > 3) {
    index = Math.floor(index % 4);
  }
  return ["#EFEFEA", "#eeeaea", "#eef0f3", "#f2f4f2"][index];
};

export const showDate = (date, type = "all") => {
  date = new Date(date);
  if (type === "day")
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  if (type === "year") return date.getFullYear();
  if (type === "month") return date.getMonth() + 1;
  if (type === "date") return date.getDate();
};

export function makeId(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function debounce(func, delay = 500) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

export const createStringURL = (searchParams, data) => {
  let newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of [...data]) {
    if (value == "") {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
  }
  return newSearchParams.toString() ? `?${newSearchParams.toString()}` : "";
};

export function formatTime(date, type = "default") {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const dateData = new Date(date);
  const diffInMinutes = diffInMs / (1000 * 60); // chuyển đổi từ ms sang phút
  const diffInHours = diffInMinutes / 60; // chuyển đổi từ phút sang giờ
  if (diffInHours > 24) {
    if (type === "default") {
      return dateData.toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    // Quá 24 giờ thì trả về định dạng giờ và ngày
    const options = {
      weekday: "long", // Định dạng thứ (ví dụ: Thứ hai)
      day: "2-digit", // Định dạng ngày (ví dụ: 20)
      month: "2-digit", // Định dạng tháng (ví dụ: 10)
      year: "numeric", // Định dạng năm (ví dụ: 2024)
      hour: "2-digit", // Định dạng giờ (ví dụ: 07)
      minute: "2-digit", // Định dạng phút (ví dụ: 44)
      timeZone: "Asia/Bangkok", // Múi giờ GMT+7
      hour12: false, // Sử dụng định dạng 24 giờ
    };

    // Định dạng ngày
    const formattedDate = dateData.toLocaleString("vi-VN", options);

    // Tách thành phần giờ và phần ngày
    const [timeAndDayCurrent, day] = formattedDate.split(", ");
    // Tách giờ và thứ
    const [time, ...dayCurrent] = timeAndDayCurrent.split(" ");

    // Thêm múi giờ
    const timeZoneOffset = " (GMT+7)";
    const result = `${dayCurrent.join(" ")}, ${day}, ${time}${timeZoneOffset}`;
    return result;
  } else if (diffInHours >= 1) {
    // Trong ngày thì trả về số giờ trước
    return `${Math.floor(diffInHours)} giờ trước`;
  } else {
    // Nếu nhỏ hơn 1 giờ thì trả về số phút trước
    return `${Math.floor(diffInMinutes)} phút trước`;
  }
}

export function formatTimeComment(date, type = "default") {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSeconds = diffInMs / 1000; // Chuyển đổi từ ms sang giây
  const diffInMinutes = diffInSeconds / 60; // Chuyển đổi từ giây sang phút
  const diffInHours = diffInMinutes / 60; // Chuyển đổi từ phút sang giờ
  const diffInDays = diffInHours / 24; // Chuyển đổi từ giờ sang ngày
  const diffInWeeks = diffInDays / 7; // Chuyển đổi từ ngày sang tuần
  const diffInMonths = diffInDays / 30; // Chuyển đổi từ ngày sang tháng (ước tính 30 ngày)
  const diffInYears = diffInDays / 365; // Chuyển đổi từ ngày sang năm (ước tính 365 ngày)

  if (diffInYears >= 1) {
    // Nếu hơn 1 năm
    return `${Math.floor(diffInYears)} năm trước`;
  } else if (diffInMonths >= 1) {
    // Nếu hơn 1 tháng
    return `${Math.floor(diffInMonths)} tháng trước`;
  } else if (diffInWeeks >= 1) {
    // Nếu hơn 1 tuần
    return `${Math.floor(diffInWeeks)} tuần trước`;
  } else if (diffInDays >= 1) {
    // Nếu hơn 1 ngày
    return `${Math.floor(diffInDays)} ngày trước`;
  } else if (diffInHours >= 1) {
    // Nếu hơn 1 giờ
    return `${Math.floor(diffInHours)} giờ trước`;
  } else if (diffInMinutes >= 1) {
    // Nếu hơn 1 phút
    return `${Math.floor(diffInMinutes)} phút trước`;
  } else {
    // Nếu nhỏ hơn 1 phút, trả về giây
    return `${Math.floor(diffInSeconds)} giây trước`;
  }
}
