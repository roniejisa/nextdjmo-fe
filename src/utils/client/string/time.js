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


/**
 * Hàm format date siêu cấp - xử lý mọi loại định dạng thời gian
 * @param {*} value - Giá trị thời gian (timestamp, string, Date object, etc.)
 * @param {string} format - Định dạng output mong muốn
 * @param {string} locale - Locale (mặc định 'vi-VN')
 * @returns {string} - Chuỗi thời gian đã được format
 */
export const superFormatDate = (value, format = 'DD/MM/YYYY', locale = 'vi-VN') => {
  if (!value) return 'Không xác định';
  
  let date;
  
  try {
    // Xử lý các loại input khác nhau
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'number') {
      // Timestamp (milliseconds hoặc seconds)
      // Nếu timestamp < 10^10 thì là seconds, cần nhân 1000
      date = new Date(value < 10000000000 ? value * 1000 : value);
    } else if (typeof value === 'string') {
      // Xử lý string date
      const trimmedValue = value.trim();
      
      // ISO format: 2023-12-25T10:30:00Z hoặc 2023-12-25T10:30:00+07:00
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmedValue)) {
        date = new Date(trimmedValue);
      }
      // Date only: 2023-12-25 hoặc 2023/12/25
      else if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(trimmedValue)) {
        date = new Date(trimmedValue);
      }
      // DD/MM/YYYY hoặc DD-MM-YYYY
      else if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(trimmedValue)) {
        const [day, month, year] = trimmedValue.split(/[-/]/);
        date = new Date(year, month - 1, day);
      }
      // MM/DD/YYYY hoặc MM-DD-YYYY (US format)
      else if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(trimmedValue) && locale.includes('US')) {
        const [month, day, year] = trimmedValue.split(/[-/]/);
        date = new Date(year, month - 1, day);
      }
      // YYYY-MM-DD HH:mm:ss
      else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmedValue)) {
        date = new Date(trimmedValue.replace(' ', 'T'));
      }
      // DD/MM/YYYY HH:mm:ss
      else if (/^\d{2}[-/]\d{2}[-/]\d{4} \d{2}:\d{2}:\d{2}$/.test(trimmedValue)) {
        const [datePart, timePart] = trimmedValue.split(' ');
        const [day, month, year] = datePart.split(/[-/]/);
        date = new Date(`${year}-${month}-${day}T${timePart}`);
      }
      // Unix timestamp as string
      else if (/^\d{10}$/.test(trimmedValue) || /^\d{13}$/.test(trimmedValue)) {
        const timestamp = parseInt(trimmedValue);
        date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
      }
      // Relative time: "2 hours ago", "yesterday", etc.
      else if (trimmedValue.includes('ago') || trimmedValue.includes('trước')) {
        date = parseRelativeTime(trimmedValue);
      }
      // Fallback: try native Date constructor
      else {
        date = new Date(trimmedValue);
      }
    } else {
      throw new Error('Unsupported date format');
    }
    
    // Kiểm tra date có hợp lệ không
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Format output theo yêu cầu
    return formatOutput(date, format, locale);
    
  } catch (error) {
    console.warn('Date parsing error:', error, 'Input:', value);
    return 'Không xác định';
  }
};

/**
 * Parse relative time strings
 */
function parseRelativeTime(str) {
  const now = new Date();
  const lowerStr = str.toLowerCase();
  
  if (lowerStr.includes('now') || lowerStr.includes('bây giờ')) {
    return now;
  }
  
  if (lowerStr.includes('yesterday') || lowerStr.includes('hôm qua')) {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
  
  if (lowerStr.includes('tomorrow') || lowerStr.includes('ngày mai')) {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  
  // Extract number and unit
  const match = str.match(/(\d+)\s*(minute|hour|day|week|month|year|phút|giờ|ngày|tuần|tháng|năm)/i);
  if (match) {
    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    const multipliers = {
      minute: 60 * 1000, phút: 60 * 1000,
      hour: 60 * 60 * 1000, giờ: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000, ngày: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000, tuần: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000, tháng: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000, năm: 365 * 24 * 60 * 60 * 1000
    };
    
    const multiplier = multipliers[unit] || 0;
    return new Date(now.getTime() - (amount * multiplier));
  }
  
  throw new Error('Cannot parse relative time');
}

/**
 * Format date object to desired output format
 */
function formatOutput(date, format, locale) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  // Predefined formats
  const formats = {
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD-MM-YYYY': `${day}-${month}-${year}`,
    'DD/MM/YYYY HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
    'DD/MM/YYYY HH:mm:ss': `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
    'YYYY-MM-DD HH:mm:ss': `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    'HH:mm': `${hours}:${minutes}`,
    'HH:mm:ss': `${hours}:${minutes}:${seconds}`,
    'relative': getRelativeTime(date, locale),
    'full': date.toLocaleDateString(locale, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    'short': date.toLocaleDateString(locale),
    'long': date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
  
  return formats[format] || formats['DD/MM/YYYY'];
}

/**
 * Get relative time string
 */
function getRelativeTime(date, locale) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    year: 31536000, năm: 31536000,
    month: 2592000, tháng: 2592000,
    week: 604800, tuần: 604800,
    day: 86400, ngày: 86400,
    hour: 3600, giờ: 3600,
    minute: 60, phút: 60
  };
  
  const isVietnamese = locale.includes('vi');
  
  if (diffInSeconds < 60) {
    return isVietnamese ? 'Vừa xong' : 'Just now';
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    if (interval >= 1) {
      if (isVietnamese) {
        const viUnits = { year: 'năm', month: 'tháng', week: 'tuần', day: 'ngày', hour: 'giờ', minute: 'phút' };
        const viUnit = viUnits[unit] || unit;
        return `${interval} ${viUnit} trước`;
      } else {
        const suffix = interval === 1 ? '' : 's';
        return `${interval} ${unit}${suffix} ago`;
      }
    }
  }
  
  return isVietnamese ? 'Vừa xong' : 'Just now';
}

