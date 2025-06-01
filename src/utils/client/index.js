// File Operations - Utils for file handling
export { 
  uploadFileResumable, 
  convertSize, 
  CHUNK_SIZE 
} from './file/upload';

export { 
  showImageUrl 
} from './file/image';

// String Operations - Utils for string manipulation
export { 
  toSlug, 
  makeId,
  capitalizeFirst,
  capitalizePreserve,
  capitalizeWords,
  cfl,
  toTitleCase,
  formatKey
} from './string/format';

export { 
  formatDate, 
  formatRelativeTime, 
  formatTimeAgo 
} from './string/time';

// UI Operations - Utils for UI elements
export { 
  randomBgColor, 
  chooseColorByIndex
} from './ui/color'

// Common Operations - General purpose utils
export { 
  debounce 
} from './common/performance';

export { 
  createQueryString 
} from './common/url';

export { 
  normalizeData,
  flattenObject,
  unflattenObject,
  deepMerge 
} from "./data/normalize";

export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isStrongPassword,
  isValidVietnameseId,
  isValidTaxCode,
  isVietnameseText,
  isPositiveInteger,
  isValidLength,
  isInAllowedList
} from './common/validation';

export {
  generateCombinations,
  generateKey,
  sortData
} from './product/variant'

