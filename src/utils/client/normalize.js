// Chuẩn hóa dữ liệu

export const normalizeData = (data) => {
    const allAttributes = new Set();
    Object.values(data).forEach((country) => {
        const extractKeys = (obj, prefix = "") => {
            for (const key in obj) {
                if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                    extractKeys(obj[key], `${prefix}${key}.`);
                } else {
                    allAttributes.add(`${prefix}${key}`);
                }
            }
        };
        extractKeys(country);
    });

    const normalized = {};
    Object.entries(data).forEach(([countryKey, countryData]) => {
        const normalizedCountry = {};
        allAttributes.forEach((attribute) => {
            const keys = attribute.split(".");
            let value = countryData;
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined) break;
            }
            normalizedCountry[attribute] = value || 0; // Gán 0 nếu không tồn tại
        });
        normalized[countryKey] = normalizedCountry;
    });
    return normalized;
}