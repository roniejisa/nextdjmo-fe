/**
 * Format ngày tháng theo nhiều kiểu khác nhau
 * @param {string|Date} date - Ngày cần format
 * @param {string} type - Kiểu format: "all", "day", "year", "month", "date"
 * @returns {string|number} - Ngày đã format
 */
export const formatDate = (date, type = "all") => {
  const dateObj = new Date(date);
  
  switch (type) {
    case "day":
      return (
        dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear()
      );
    case "year":
      return dateObj.getFullYear();
    case "month":
      return dateObj.getMonth() + 1;
    case "date":
      return dateObj.getDate();
    default:
      return dateObj.toLocaleDateString("vi-VN");
  }
};

/**
 * Format thời gian relative (1 giờ trước, 2 ngày trước, etc.)
 * @param {string|Date} date - Ngày cần format
 * @param {string} type - Kiểu format: "default" hoặc "detailed"
 * @returns {string} - Thời gian relative
 */
export const formatRelativeTime = (date, type = "default") => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const dateData = new Date(date);
  const diffInMinutes = diffInMs / (1000 * 60);
  const diffInHours = diffInMinutes / 60;

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

    // Format chi tiết với thứ và múi giờ
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bangkok",
      hour12: false,
    };

    const formattedDate = dateData.toLocaleString("vi-VN", options);
    const [timeAndDayCurrent, day] = formattedDate.split(", ");
    const [time, ...dayCurrent] = timeAndDayCurrent.split(" ");
    const timeZoneOffset = " (GMT+7)";
    
    return `${dayCurrent.join(" ")}, ${day}, ${time}${timeZoneOffset}`;
  } else if (diffInHours >= 1) {
    return `${Math.floor(diffInHours)} giờ trước`;
  } else {
    return `${Math.floor(diffInMinutes)} phút trước`;
  }
};

/**
 * Format thời gian cho comment (chi tiết hơn formatRelativeTime)
 * @param {string|Date} date - Ngày cần format
 * @returns {string} - Thời gian ago format
 */
export const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSeconds = diffInMs / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInWeeks = diffInDays / 7;
  const diffInMonths = diffInDays / 30;
  const diffInYears = diffInDays / 365;

  if (diffInYears >= 1) {
    return `${Math.floor(diffInYears)} năm trước`;
  } else if (diffInMonths >= 1) {
    return `${Math.floor(diffInMonths)} tháng trước`;
  } else if (diffInWeeks >= 1) {
    return `${Math.floor(diffInWeeks)} tuần trước`;
  } else if (diffInDays >= 1) {
    return `${Math.floor(diffInDays)} ngày trước`;
  } else if (diffInHours >= 1) {
    return `${Math.floor(diffInHours)} giờ trước`;
  } else if (diffInMinutes >= 1) {
    return `${Math.floor(diffInMinutes)} phút trước`;
  } else {
    return `${Math.floor(diffInSeconds)} giây trước`;
  }
};