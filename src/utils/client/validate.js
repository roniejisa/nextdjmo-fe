export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
}

export function isValidPhone(phone) {
    const phoneRegex = /^(?:\+84|0)\d{9}$/; // Số điện thoại từ 10 đến 15 chữ số
    return phoneRegex.test(phone);
}