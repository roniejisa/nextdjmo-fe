import CryptoJS from "crypto-js";

const secretKey = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef"); // Khóa bí mật (32 ký tự cho AES-256)
const iv = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210"); // IV (16 ký tự)

// Hàm mã hóa
export const encryptData = (data) => {
    const jsonData = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonData, secretKey, { iv: iv });
    return encrypted.toString(); // Chuỗi mã hóa Base64
};

export const decryptData = (encryptedData) => {
    try {
        // Giải mã AES
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        // Chuyển bytes thành chuỗi
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};