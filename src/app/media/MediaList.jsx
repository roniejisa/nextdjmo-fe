"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMedia } from "./MediaProvider";
import ImageType from "./types/ImageType";
import VideoType from "./types/VideoType";
import MediaItem from "./MediaItem";
import { GalleryContext } from "@/context/cms/ImageProvider";
import { fetchFiles } from "./action";
import DefaultType from "./types/DefaultType";
import Folder from "./Folder";
import LoadingIcon from "@/components/Icon/svg/Loading";

// Media type mapping
const mediaType = {
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
const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
};

/**
 * View Mode Toggle Component
 */
const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  const handleViewModeChange = (newMode) => {
    onViewModeChange(newMode);
    // Clear all selections when switching view mode to avoid conflicts
    setTimeout(() => {
      const items = Array.from(
        document.querySelectorAll(".item input[type='checkbox']")
      );
      items.forEach((input) => {
        input.checked = false;
      });
    }, 50);
  };

  return (
    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
      <button
        onClick={() => handleViewModeChange(VIEW_MODES.GRID)}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === VIEW_MODES.GRID
            ? "bg-white/80 text-blue-600 shadow-sm"
            : "text-gray-600 hover:bg-white/40"
        }`}
        title="Grid View"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => handleViewModeChange(VIEW_MODES.LIST)}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === VIEW_MODES.LIST
            ? "bg-white/80 text-blue-600 shadow-sm"
            : "text-gray-600 hover:bg-white/40"
        }`}
        title="List View"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      </button>
    </div>
  );
};

/**
 * Media Header Component
 */
const MediaHeader = ({ viewMode, onViewModeChange, itemCount }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-white/50">
      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-semibold text-gray-800 select-none">
          Tệp tin
        </h3>
        <span className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">
          {itemCount} items
        </span>
      </div>
      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
};

/**
 * Grid View Component
 */
const GridView = ({
  medias,
  mediaItemRef,
  handleMouseDown,
  handleClick,
  handleDoubleClick,
  observerRef,
}) => {
  return (
    <section
      ref={mediaItemRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 px-6 py-6 select-none gap-x-4 gap-y-8 overflow-auto file-selector"
      onMouseDown={handleMouseDown}
    >
      {medias?.map((media, index) => {
        let Component = mediaType[media.extention] || mediaType["default"];

        return (
          <MediaItem
            key={`${media._id}-${index}`}
            {...media}
            className="item group relative bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-white/80 has-[input:checked]:ring-2 has-[input:checked]:ring-blue-400 has-[input:checked]:bg-blue-50/80 has-[input:checked]:shadow-lg"
            onClick={handleClick}
            index={index}
            onDoubleClick={(e) => handleDoubleClick(e, media)}
          >
            <input type="checkbox" hidden />
            <div className="">
              <Component media={media} />
              <p className="line-clamp-1">{media?.filename ?? media?.name}</p>
            </div>
          </MediaItem>
        );
      })}
      <span ref={observerRef} className="w-full col-span-full"></span>
    </section>
  );
};

/**
 * List View Component
 */
const ListView = ({
  medias,
  mediaItemRef,
  handleMouseDown,
  handleClick,
  handleDoubleClick,
  observerRef,
}) => {
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-6 py-4">
      {/* List Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50 text-sm font-medium text-gray-700 mb-2">
        <div className="col-span-6 md:col-span-5">Tên</div>
        <div className="col-span-3 md:col-span-2 hidden sm:block">
          Kích thước
        </div>
        <div className="col-span-3 md:col-span-2 hidden md:block">Loại</div>
        <div className="col-span-3 hidden lg:block">Ngày sửa đổi</div>
      </div>

      {/* List Content */}
      <section
        ref={mediaItemRef}
        className="space-y-1 select-none max-h-[calc(100%-180px)] overflow-auto file-selector"
        onMouseDown={handleMouseDown}
      >
        {medias?.map((media, index) => {
          let Component = mediaType[media.extention] || mediaType["default"];

          return (
            <MediaItem
              key={`${media._id}-${index}`}
              {...media}
              className="item group bg-white/40 backdrop-blur-sm rounded-lg border border-transparent transition-all duration-200 hover:bg-white/60 hover:border-white/50 hover:shadow-sm has-[input:checked]:bg-blue-50/60 has-[input:checked]:border-blue-200 has-[input:checked]:shadow-sm"
              onClick={handleClick}
              index={index}
              onDoubleClick={(e) => handleDoubleClick(e, media)}
            >
              <input type="checkbox" hidden />
              <div className="grid grid-cols-12 gap-4 items-center p-3">
                {/* File Icon & Name */}
                <div className="col-span-6 md:col-span-5 flex items-center space-x-3 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8">
                    <Component media={media} />
                  </div>
                  <span className="truncate text-sm font-medium text-gray-800 group-hover:text-blue-600">
                    {media.name || media.filename || "Unnamed"}
                  </span>
                </div>

                {/* File Size */}
                <div className="col-span-3 md:col-span-2 hidden sm:block text-sm text-gray-500">
                  {media.size ? formatFileSize(media.size) : "--"}
                </div>

                {/* File Type */}
                <div className="col-span-3 md:col-span-2 hidden md:block text-sm text-gray-500 uppercase">
                  {media.extention?.replace(".", "") || "Unknown"}
                </div>

                {/* Modified Date */}
                <div className="col-span-3 hidden lg:block text-sm text-gray-500">
                  {media.updatedAt ? formatDate(media.updatedAt) : "--"}
                </div>
              </div>
            </MediaItem>
          );
        })}
        <span ref={observerRef} className="w-full block"></span>
      </section>
    </div>
  );
};

/**
 * Main MediaList Component
 */
const MediaList = () => {
  const limitRef = useRef(20);
  const observerRef = useRef();

  // View mode state
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [isLoading, setIsLoading] = useState(false);

  // Media context
  const {
    medias,
    setMedias,
    canvasRef,
    mediaItemRef,
    divCloneCanvasRef,
    itemsRef,
    selectingRef,
    itemsSelectingRef,
    positionTransformRef,
    ctxRef,
    pageXRef,
    pageYRef,
    movePageX,
    movePageY,
    breadcrumbs,
    page,
    setPage,
    loadedPages,
  } = useMedia((media) => media);

  const { setChoosed, setListImage, isMultiple } = useContext(GalleryContext);

  // Effect to update items reference when medias, breadcrumbs, or viewMode change
  useEffect(() => {
    // Use setTimeout to ensure DOM is updated after view mode change
    const updateItemsRef = () => {
      itemsRef.current = Array.from(document.querySelectorAll(".item"));
    };

    // Update immediately
    updateItemsRef();

    // Also update after a small delay to catch any delayed DOM updates
    const timeoutId = setTimeout(updateItemsRef, 100);

    if (canvasRef.current && mediaItemRef.current) {
      canvasRef.current.height = mediaItemRef.current.scrollHeight;
    }

    // Add event listeners for mouse events
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medias, breadcrumbs, viewMode]);

  /**
   * Handle mouse down for selection rectangle
   */
  const handleMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      if (!event.target.closest(".item") && mediaItemRef.current) {
        // Ensure itemsRef is updated before starting selection
        itemsRef.current = Array.from(document.querySelectorAll(".item"));

        selectingRef.current = true;
        itemsSelectingRef.current = getSelectedItems();
        canvasRef.current = document.createElement("canvas");
        ctxRef.current = canvasRef.current.getContext("2d");
        const rect = mediaItemRef.current.getBoundingClientRect();
        pageXRef.current = event.pageX - rect.left - window.pageXOffset;
        pageYRef.current = event.pageY - rect.top - window.pageYOffset;
        mediaItemRef.current.style.position = "relative";
        canvasRef.current.style.position = "absolute";
        canvasRef.current.style.zIndex = "9999";
        canvasRef.current.width = mediaItemRef.current.clientWidth;
        canvasRef.current.height = mediaItemRef.current.scrollHeight;
        canvasRef.current.style.left = 0;
        canvasRef.current.style.top = 0;
        mediaItemRef.current.append(canvasRef.current);

        // Create clone div for canvas
        divCloneCanvasRef.current = document.createElement("div");
        divCloneCanvasRef.current.style.position = "absolute";
        divCloneCanvasRef.current.style.zIndex = "1000";
        mediaItemRef.current.append(divCloneCanvasRef.current);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [medias, viewMode]
  );

  /**
   * Handle mouse move for selection rectangle
   */
  const handleMouseMove = useCallback(
    (event) => {
      if (selectingRef.current) {
        let x, y;
        const canvas = canvasRef.current;
        if (event.target === canvas) {
          x = event.offsetX - pageXRef.current;
          y = event.offsetY - pageYRef.current;
          const ctx = ctxRef.current;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw selection rectangle
          ctx.beginPath();
          ctx.rect(pageXRef.current, pageYRef.current, x, y);
          ctx.fillStyle = "#80afe799";
          ctx.fill();
          movePageX.current = event.offsetX;
          movePageY.current = event.offsetY;

          // Calculate position transform based on drag direction
          if (
            event.offsetX >= pageXRef.current &&
            event.offsetY >= pageYRef.current
          ) {
            positionTransformRef.current = {
              x: pageXRef.current,
              y: pageYRef.current,
            };
          } else if (
            event.offsetX >= pageXRef.current &&
            event.offsetY <= pageYRef.current
          ) {
            positionTransformRef.current = {
              x: pageXRef.current,
              y: movePageY.current,
            };
          } else if (
            event.offsetX <= pageXRef.current &&
            event.offsetX &&
            event.offsetY >= pageYRef.current
          ) {
            positionTransformRef.current = {
              x: movePageX.current,
              y: pageYRef.current,
            };
          } else {
            positionTransformRef.current = {
              x: movePageX.current,
              y: movePageY.current,
            };
          }

          // Update clone div dimensions and position
          divCloneCanvasRef.current.style.width = Math.abs(x) + "px";
          divCloneCanvasRef.current.style.height = Math.abs(y) + "px";
          divCloneCanvasRef.current.style.top =
            positionTransformRef.current.y + "px";
          divCloneCanvasRef.current.style.left =
            positionTransformRef.current.x + "px";

          // Handle item selection based on collision with selection rectangle
          Array.from(itemsRef.current).forEach((item) => {
            if (
              isCollision(item, divCloneCanvasRef.current) &&
              event.ctrlKey &&
              itemsSelectingRef.current.includes(item)
            ) {
              item.firstElementChild.checked = false;
            } else if (
              isCollision(item, divCloneCanvasRef.current) ||
              (event.ctrlKey && itemsSelectingRef.current.includes(item)) ||
              (event.shiftKey && itemsSelectingRef.current.includes(item))
            ) {
              if (!item.firstElementChild.checked)
                item.firstElementChild.checked = true;
            } else {
              item.firstElementChild.checked = false;
            }
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [medias]
  );

  /**
   * Handle mouse up to end selection
   */
  const handleMouseUp = useCallback(() => {
    divCloneCanvasRef.current && divCloneCanvasRef.current.remove();
    positionTransformRef.current = undefined;
    selectingRef.current = false;
    canvasRef.current && canvasRef.current.remove();

    setTimeout(() => {
      const listMedia = [];
      itemsSelectingRef.current = getSelectedItems();
      for (const index in itemsSelectingRef.current) {
        listMedia.push(medias[index]);
      }
      setListImage(listMedia);
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medias]);

  /**
   * Check collision between two elements
   */
  function isCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return (
      rect1.left < rect2.left + rect2.width &&
      rect1.left + rect1.width > rect2.left &&
      rect1.top < rect2.top + rect2.height &&
      rect1.top + rect1.height > rect2.top
    );
  }

  /**
   * Get selected items with optional position filter
   */
  const getSelectedItems = (position = undefined) => {
    const listItemSelecting = [];
    let firstIndex = null;
    let lastIndex = null;
    let index = 0;

    for (const item of itemsRef.current) {
      if (item.firstElementChild.checked) {
        if (firstIndex === null) {
          firstIndex = index;
        }
        lastIndex = index;
        listItemSelecting[index] = item;
      }
      index++;
    }

    let objectItem;
    switch (position) {
      case "start":
        objectItem = {
          index: firstIndex,
          item: listItemSelecting[firstIndex],
        };
        return objectItem;
      case "last":
        objectItem = {
          index: lastIndex,
          item: listItemSelecting[lastIndex],
        };
        return objectItem;
      default:
        return listItemSelecting;
    }
  };

  /**
   * Handle item click with selection logic
   */
  const handleClick = (event) => {
    event.preventDefault();

    // Ensure itemsRef is updated before handling click
    itemsRef.current = Array.from(document.querySelectorAll(".item"));

    const _this = event.currentTarget;
    let startItemChecked = getSelectedItems("start");
    let lastItemChecked = getSelectedItems("last");
    let listItemSelecting = getSelectedItems();

    if (!event.ctrlKey && !event.shiftKey) {
      // Single selection
      if (listItemSelecting.length) {
        listItemSelecting.forEach((item) => {
          if (item !== _this) {
            item.firstElementChild.checked = false;
          }
        });
      }
      _this.firstElementChild.checked = !_this.firstElementChild.checked;
    } else if (event.ctrlKey) {
      // Ctrl + click for multiple selection
      _this.firstElementChild.checked = !_this.firstElementChild.checked;
    } else if (event.shiftKey) {
      // Shift + click for range selection
      if (listItemSelecting.length) {
        _this.index = Number(_this.getAttribute("index"));

        // Check for gaps between start and last selected items
        let isIndexNotSeamless = null;
        for (let i = startItemChecked.index; i <= lastItemChecked.index; i++) {
          if (!listItemSelecting[i]) {
            isIndexNotSeamless = i - 1;
            break;
          }
        }

        // Handle different range selection scenarios
        if (_this.index >= lastItemChecked.index && !isIndexNotSeamless) {
          // Target is greater and no gaps
          let indexStart = lastItemChecked.index + 1;
          while (indexStart <= _this.index) {
            if (itemsRef.current[indexStart]) {
              itemsRef.current[indexStart].firstElementChild.checked = true;
            }
            indexStart++;
          }
        } else if (_this.index >= lastItemChecked.index && isIndexNotSeamless) {
          // Target is greater with gaps
          let indexStart = isIndexNotSeamless + 1;
          while (indexStart <= _this.index) {
            if (itemsRef.current[indexStart]) {
              itemsRef.current[indexStart].firstElementChild.checked = true;
            }
            indexStart++;
          }
        } else if (
          _this.index <= lastItemChecked.index &&
          _this.index >= startItemChecked.index &&
          !isIndexNotSeamless
        ) {
          // Target is within range without gaps
          for (
            let i = startItemChecked.index;
            i <= lastItemChecked.index;
            i++
          ) {
            if (listItemSelecting[i]) {
              listItemSelecting[i].firstElementChild.checked = i <= _this.index;
            }
          }
        } else if (
          _this.index <= lastItemChecked.index &&
          _this.index >= startItemChecked.index &&
          isIndexNotSeamless
        ) {
          // Target is within range with gaps
          for (
            let i = startItemChecked.index;
            i <= lastItemChecked.index;
            i++
          ) {
            if (listItemSelecting[i]) {
              listItemSelecting[i].firstElementChild.checked = i <= _this.index;
            }
          }
        } else if (_this.index < startItemChecked.index) {
          // Target is before start
          let indexStart = _this.index;
          while (indexStart <= startItemChecked.index) {
            if (itemsRef.current[indexStart]) {
              itemsRef.current[indexStart].firstElementChild.checked = true;
            }
            indexStart++;
          }
        }
      } else {
        // No items selected, select from beginning to target
        Array.from(itemsRef.current)
          .filter((item, index) => index <= _this.index)
          .forEach((item) => (item.firstElementChild.checked = true));
      }
    }
  };

  /**
   * Handle double click to select item
   */
  const handleDoubleClick = (e, item) => {
    if (!isMultiple) {
      setChoosed(item);
    }
  };

  /**
   * Load media files with pagination
   */
  const loadMedias = useCallback(async () => {
    if (loadedPages.current.has(page)) return;

    setIsLoading(true);
    const {status, data, message} = await fetchFiles(limitRef.current, page, {
      folder_id: breadcrumbs[breadcrumbs.length - 1]?._id || null,
    }); 
    setMedias((prevPosts) => {
      const allPosts = [...prevPosts, ...data];
      // Filter duplicates based on id
      return allPosts.filter(
        (post, index, self) =>
          self.findIndex((p) => p._id === post._id) === index
      );
    });

    loadedPages.current.add(page);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, breadcrumbs, loadedPages]);

  // Load medias on mount and when dependencies change
  useEffect(() => {
    loadMedias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breadcrumbs, loadedPages, page]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!medias.length) return;

    const targetIndex = page * limitRef.current - 1;
    if (!medias[targetIndex]) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-80px",
      }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medias, page, breadcrumbs]);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-sm">
      {/* Folder Component */}
      <Folder />

      {/* Media Content */}
      {medias && medias.length > 0 && (
        <div className="h-full flex flex-col bg-white/30 backdrop-blur-md rounded-t-2xl border-t border-white/50 shadow-2xl">
          {/* Header */}
          <MediaHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            itemCount={medias.length}
          />

          {/* Content based on view mode */}
          {viewMode === VIEW_MODES.GRID ? (
            <GridView
              medias={medias}
              mediaItemRef={mediaItemRef}
              handleMouseDown={handleMouseDown}
              handleClick={handleClick}
              handleDoubleClick={handleDoubleClick}
              observerRef={observerRef}
            />
          ) : (
            <ListView
              medias={medias}
              mediaItemRef={mediaItemRef}
              handleMouseDown={handleMouseDown}
              handleClick={handleClick}
              handleDoubleClick={handleDoubleClick}
              observerRef={observerRef}
            />
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <LoadingIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaList;
