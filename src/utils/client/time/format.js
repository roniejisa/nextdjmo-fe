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

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
