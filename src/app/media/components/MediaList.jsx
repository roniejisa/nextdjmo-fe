/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { fetchFiles } from "../action";
import Folder from "./Folder";
import LoadingIcon from "@/components/Icon/svg/Loading";
import { VIEW_MODES } from "../lib";
import MediaHeader from "./MediaHeader";
import GridView from "./GridView";
import ListView from "./ListView";
import { useAutoMaxHeight } from "@/hooks/useAutoMaxHeight";
import { useMediaStore } from "@/stories/files/mediaStore";
import { useImageStore } from "@/stories/files/imageStore";

const MediaList = () => {
  const limitRef = useRef(20);
  const observerRef = useRef();

  // Refs for selection logic - these stay as refs since they don't trigger re-renders
  const mediaItemRef = useRef(null);
  const canvasRef = useRef(null);
  const divCloneCanvasRef = useRef(null);
  const selectingRef = useRef(false);
  const itemsRef = useRef(null);
  const itemsSelectingRef = useRef([]);
  const positionTransformRef = useRef(undefined);
  const ctxRef = useRef(null);
  const pageXRef = useRef(0);
  const pageYRef = useRef(0);
  const movePageX = useRef(0);
  const movePageY = useRef(0);
  // Thêm ref để track thời gian mousedown
  const mouseDownTimeRef = useRef(0);
  const mouseDownPositionRef = useRef({ x: 0, y: 0 });

  // Local state
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [isLoading, setIsLoading] = useState(false);

  // Zustand selectors - chỉ subscribe vào state cần thiết
  const medias = useMediaStore((state) => state.medias);
  const breadcrumbs = useMediaStore((state) => state.breadcrumbs);
  const page = useMediaStore((state) => state.page);
  const loadedPages = useMediaStore((state) => state.loadedPages);
  const selectedFilter = useMediaStore((state) => state.selectedFilter);
  const searchTerm = useMediaStore((state) => state.searchTerm);

  // Zustand actions
  const appendMedias = useMediaStore((state) => state.appendMedias);
  const incrementPage = useMediaStore((state) => state.incrementPage);
  const addToLoadedPages = useMediaStore((state) => state.addToLoadedPages);
  const setSelectedFilter = useMediaStore((state) => state.setSelectedFilter);
  const setSearchTerm = useMediaStore((state) => state.setSearchTerm);
  const getFilteredMedias = useMediaStore((state) => state.getFilteredMedias);

  // Image store
  const setChoosed = useImageStore((state) => state.setChoosed);
  const setListFileSelected = useImageStore(
    (state) => state.setListFileSelected
  );
  const isMultiple = useImageStore((state) => state.isMultiple);

  // Get filtered medias using the store function
  const filteredMedias = useMemo(
    () => getFilteredMedias(),
    [medias, selectedFilter, searchTerm, getFilteredMedias]
  );

  useAutoMaxHeight(mediaItemRef, 3, [filteredMedias, viewMode]);

  /**
   * Start selection rectangle
   */
  const startSelection = useCallback((event) => {
    if (!mediaItemRef.current) return;

    // Ensure itemsRef is updated before starting selection
    itemsRef.current = Array.from(document.querySelectorAll(".item"));

    // Start rectangle selection
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
  }, []);

  /**
   * Handle mouse down for selection rectangle
   */
  const handleMouseDown = useCallback(
    (event) => {
      event.preventDefault();

      // Lưu thời gian và vị trí mousedown
      mouseDownTimeRef.current = Date.now();
      mouseDownPositionRef.current = { x: event.pageX, y: event.pageY };

      const clickedItem = event.target.closest(".item");

      if (!clickedItem) {
        // Click vào khoảng trống - clear selections và bắt đầu vùng chọn ngay
        const currentItems = Array.from(document.querySelectorAll(".item"));
        currentItems.forEach((item) => {
          if (item.firstElementChild) {
            item.firstElementChild.checked = false;
          }
        });
        setListFileSelected([]);
        startSelection(event);
      }
      // Nếu click vào item, không làm gì ở mousedown, để mousemove quyết định
    },
    [setListFileSelected, startSelection]
  );

  /**
   * Handle click outside to clear selection
   */
  const handleClickOutside = useCallback(
    (event) => {
      // Check if click is outside the media container
      if (
        mediaItemRef.current &&
        !mediaItemRef.current.contains(event.target) &&
        !event.target.closest(".item")
      ) {
        // Clear all selections
        const currentItems = Array.from(document.querySelectorAll(".item"));
        currentItems.forEach((item) => {
          if (item.firstElementChild) {
            item.firstElementChild.checked = false;
          }
        });

        // Update the selected files list to empty
        setListFileSelected([]);
      }
    },
    [setListFileSelected]
  );

  /**
   * Handle mouse move for selection rectangle
   */
  const handleMouseMove = useCallback(
    (event) => {
      // Kiểm tra nếu đang giữ chuột và di chuyển đủ xa
      if (mouseDownTimeRef.current > 0 && !selectingRef.current) {
        const timeDiff = Date.now() - mouseDownTimeRef.current;
        const distance = Math.sqrt(
          Math.pow(event.pageX - mouseDownPositionRef.current.x, 2) +
            Math.pow(event.pageY - mouseDownPositionRef.current.y, 2)
        );

        // Nếu giữ chuột hơn 100ms hoặc di chuyển hơn 5px thì bắt đầu selection
        if (timeDiff > 100 || distance > 5) {
          // Tạo event giả để bắt đầu selection từ vị trí mousedown ban đầu
          const fakeEvent = {
            pageX: mouseDownPositionRef.current.x,
            pageY: mouseDownPositionRef.current.y,
            preventDefault: () => {},
          };

          // Clear selections nếu chưa clear
          if (!selectingRef.current) {
            const currentItems = Array.from(document.querySelectorAll(".item"));
            currentItems.forEach((item) => {
              if (item.firstElementChild) {
                item.firstElementChild.checked = false;
              }
            });
            setListFileSelected([]);
          }

          startSelection(fakeEvent);
        }
      }

      if (selectingRef.current) {
        let x, y;
        const canvas = canvasRef.current;
        if (event.target === canvas || selectingRef.current) {
          const rect = mediaItemRef.current.getBoundingClientRect();
          const currentX = event.pageX - rect.left - window.pageXOffset;
          const currentY = event.pageY - rect.top - window.pageYOffset;

          x = currentX - pageXRef.current;
          y = currentY - pageYRef.current;

          const ctx = ctxRef.current;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw selection rectangle
          ctx.beginPath();
          ctx.rect(pageXRef.current, pageYRef.current, x, y);
          ctx.fillStyle = "#80afe799";
          ctx.fill();
          movePageX.current = currentX;
          movePageY.current = currentY;

          // Calculate position transform based on drag direction
          if (currentX >= pageXRef.current && currentY >= pageYRef.current) {
            positionTransformRef.current = {
              x: pageXRef.current,
              y: pageYRef.current,
            };
          } else if (
            currentX >= pageXRef.current &&
            currentY <= pageYRef.current
          ) {
            positionTransformRef.current = {
              x: pageXRef.current,
              y: movePageY.current,
            };
          } else if (
            currentX <= pageXRef.current &&
            currentY >= pageYRef.current
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
    },
    [startSelection, setListFileSelected]
  );

  /**
   * Handle mouse up to end selection
   */
  const handleMouseUp = useCallback(() => {
    // Reset mousedown tracking
    mouseDownTimeRef.current = 0;
    mouseDownPositionRef.current = { x: 0, y: 0 };

    if (selectingRef.current) {
      divCloneCanvasRef.current && divCloneCanvasRef.current.remove();
      positionTransformRef.current = undefined;
      selectingRef.current = false;
      canvasRef.current && canvasRef.current.remove();

      setTimeout(() => {
        const listMediaSelected = [];
        itemsSelectingRef.current = getSelectedItems();
        for (const index in itemsSelectingRef.current) {
          listMediaSelected.push(filteredMedias[index]);
        }
        setListFileSelected(listMediaSelected);
      }, 200);
    }
  }, [setListFileSelected, filteredMedias]);

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

  // Tiếp tục từ dòng handleClick:
  const handleClick = (event) => {
    // Nếu vừa kết thúc selection thì không xử lý click
    if (Date.now() - mouseDownTimeRef.current < 50 && selectingRef.current) {
      return;
    }

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

    // Update selected files list after click
    setTimeout(() => {
      const listMediaSelected = [];
      const selectedItems = getSelectedItems();
      for (const index in selectedItems) {
        listMediaSelected.push(filteredMedias[index]);
      }
      setListFileSelected(listMediaSelected);
    }, 50);
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
    if (loadedPages.has(page)) return;

    setIsLoading(true);
    try {
      const { status, data, message } = await fetchFiles(
        limitRef.current,
        page,
        {
          folder_id: breadcrumbs[breadcrumbs.length - 1]?._id || null,
        }
      );

      if (status === 200 && data) {
        appendMedias(data);
        addToLoadedPages(page);
      }
    } catch (error) {
      console.error("Error loading medias:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, breadcrumbs, loadedPages, appendMedias, addToLoadedPages]);

  // Load medias on mount and when dependencies change
  useEffect(() => {
    loadMedias();
  }, [loadMedias]);

  // Event listeners setup
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleMouseUp, handleMouseMove, handleClickOutside]);

  // DOM updates effect
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

    return () => {
      clearTimeout(timeoutId);
    };
  }, [filteredMedias, breadcrumbs, viewMode]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!filteredMedias.length) return;

    const targetIndex = page * limitRef.current - 1;
    if (!filteredMedias[targetIndex]) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          incrementPage();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-80px",
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [filteredMedias, page, breadcrumbs, incrementPage]);

  return (
    <>
      <div className="flex flex-wrap">
        {/* Folder Component */}
        <div className="select-none flex-[0_0_20%] border-r shadow-[1px_0px_1px_#eef2ff] relative">
          <Folder />
        </div>

        {/* Media Content */}
        <div className="flex flex-col shadow-2xl flex-1">
          {/* Header */}
          <MediaHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            itemCount={medias.length}
            filteredCount={filteredMedias.length}
            onFilterChange={setSelectedFilter}
            onSearchChange={setSearchTerm}
            searchTerm={searchTerm}
            selectedFilter={selectedFilter}
          />
          {filteredMedias && filteredMedias.length > 0 && (
            <>
              {/* Content based on view mode */}
              {viewMode === VIEW_MODES.GRID ? (
                <GridView
                  medias={filteredMedias}
                  mediaItemRef={mediaItemRef}
                  handleMouseDown={handleMouseDown}
                  handleClick={handleClick}
                  handleDoubleClick={handleDoubleClick}
                  observerRef={observerRef}
                  viewMode={viewMode}
                />
              ) : (
                <ListView
                  medias={filteredMedias}
                  mediaItemRef={mediaItemRef}
                  handleMouseDown={handleMouseDown}
                  handleClick={handleClick}
                  handleDoubleClick={handleDoubleClick}
                  observerRef={observerRef}
                  viewMode={viewMode}
                />
              )}
            </>
          )}
        </div>
      </div>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <LoadingIcon />
          </div>
        </div>
      )}
    </>
  );
};

export default MediaList;