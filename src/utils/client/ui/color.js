/**
 * Tạo màu background ngẫu nhiên (hex format)
 * @returns {string} - Mã màu hex (vd: "#A1B2C3")
 */
export const randomBgColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

/**
 * Chọn màu theo index từ palette định sẵn
 * @param {number} index - Index của màu cần chọn
 * @returns {string} - Mã màu hex
 */
export const chooseColorByIndex = (index) => {
  const colors = ["#EFEFEA", "#eeeaea", "#eef0f3", "#f2f4f2"];

  if (index > 3) {
    index = Math.floor(index % 4);
  }

  return colors[index];
};
