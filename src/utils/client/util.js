import { httpClient } from "../http";

export const CHUNK_SIZE = 2 * 1024 * 1024; // 5MB

export const uploadFileResumable = async (file, obj, onProgress, onSetMedia, token) => {
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
        const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/upload-file", {
            Authorization: `Bearer ${token}`,
        }, formData, "POST");
        if (response.status == 200 || response.status == 201) {
            // const percentage = Math.round(((chunkIndex + 1) / totalFiles) * 100);
            onProgress(); // Gọi callback cập nhật tiến độ
            if (response.status == 201) {
                onSetMedia(response.data); // Gọi callback cập nhật tiến độ
            }
        } else {
            return response
        }
        // } catch (error) {
        //     console.error("Error uploading chunk:", error);
        //     return false;
        // }
    }

    return true; // Upload hoàn tất
};

export const convertSize = (bytes, decimals = 1) => {
    if (!+bytes) return '0 B'
    const k = 1024
    let dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    if (i < 3) {
        dm = 0
    }
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


export const showImageUrl = (imageData) => {
    const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL?.replace(/\/?$/, "/");
    if (!imageData) return "/next.svg";

    // Nếu `url` là object và có `url` bên trong
    if (typeof imageData === "object" && imageData?.url) {
        return imageData.url.startsWith("/") ? baseUrl + imageData.url.slice(1) : baseUrl + imageData.url;
    }

    // Nếu `url` là string và là URL đầy đủ
    if (/^(https?:|blob:|\/\/)/.test(imageData)) return imageData;

    // Nếu `url` là string và bắt đầu bằng "/"
    if (imageData.startsWith("/")) return baseUrl + imageData.slice(1);

    // Thử parse `url` như JSON
    try {
        const parsed = JSON.parse(imageData);
        if (parsed?.url) {
            return parsed.url.startsWith("/")
                ? baseUrl + parsed.url.slice(1)
                : baseUrl + parsed.url;
        }
    } catch {
        // Bỏ qua lỗi nếu JSON không hợp lệ
    }

    // Trả về mặc định nếu không khớp điều kiện nào
    return "/next.svg";
};


export const toSlug = (value) => {
    return value.toLowerCase() // Chuyển thành chữ thường
        .replace(/đ/g, "d") // Xử lý chữ "đ"
        .normalize("NFD") // Chuẩn hóa ký tự Unicode (hỗ trợ tiếng Việt)
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
        .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự không hợp lệ
        .trim() // Xóa khoảng trắng thừa
        .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
}

export const randomBgColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const chooseColorIndex = (index) => {
    if (index > 3) {
        index = Math.floor(index % 4)
    }
    return ["#EFEFEA", "#eeeaea", "#eef0f3", "#f2f4f2"][index]
}

export const showDate = (date, type = "all") => {
    date = new Date(date);
    if (type === "day") return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    if (type === "year") return date.getFullYear();
    if (type === "month") return date.getMonth() + 1;
    if (type === "date") return date.getDate();
}

export function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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
