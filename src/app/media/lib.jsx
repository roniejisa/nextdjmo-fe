import DefaultType from "./types/DefaultType";
import ImageType from "./types/ImageType";
import VideoType from "./types/VideoType";

// Media type mapping
export const mediaType = {
  ".png": ImageType,
  ".jpg": ImageType,
  ".jpeg": ImageType,
  ".gif": ImageType,
  ".avif": ImageType,
  ".webp": ImageType,
  ".mp4": VideoType,
  default: DefaultType,
};

// View mode constants
export const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
};
