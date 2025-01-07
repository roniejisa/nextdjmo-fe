"use client";

import {
  use,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMedia } from "./MediaProvider";
import ImageType from "./types/ImageType";
import VideoType from "./types/VideoType";
import MediaItem from "./MediaItem";
import { GalleryContext } from "@/context/ImageProvider";
// import { httpClient } from "@/utils/http";
import { fetchPosts, getFolders } from "./action";
import FolderUpload from "@/components/Icon/svg/FolderUpload";
import Dot from "@/components/Icon/svg/Dot";
import Trash from "@/components/Icon/svg/Trash";
import Edit from "@/components/Icon/svg/Edit";
import Open from "@/components/Icon/svg/Open";
import DefaultType from "./types/DefaultType";

const mediaType = {
  ".png": ImageType,
  ".jpg": ImageType,
  ".jpeg": ImageType,
  ".gif": ImageType,
  ".webp": ImageType,
  ".mp4": VideoType,
  "default": DefaultType
};

const MediaList = () => {
  const limitRef = useRef(20);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef();
  const loadedPages = useRef(new Set());
  const {
    folders,
    setFolders,
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
  } = useMedia((media) => media);

  const { setChoosed, setListImage, isMultiple } = useContext(GalleryContext);

  const [openMenuIndex, setOpenMenuIndex] = useState(null); // Lưu index của menu đang mở
  const menuRefs = useRef([]); // Mảng chứa ref của từng menu

  useEffect(() => {
    itemsRef.current = Array.from(document.querySelectorAll(".item"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medias]);

  const handleClickOutside = (event) => {
    // Kiểm tra nếu click xảy ra ngoài tất cả các menu
    
    if (menuRefs.current.some((ref) => {
      return event.target.contains(ref.el)
    })) {
      setOpenMenuIndex(null); // Đóng menu
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Refresh items on mount

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medias]);

  const handleMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      if (!event.target.closest(".item")) {
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

        // Thêm divClone hình của canvas
        divCloneCanvasRef.current = document.createElement("div");
        divCloneCanvasRef.current.style.position = "absolute";
        divCloneCanvasRef.current.style.zIndex = "1000";
        mediaItemRef.current.append(divCloneCanvasRef.current);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [medias]
  );

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.height = mediaItemRef.current.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medias]);
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
          // Vẽ hình chữ nhật
          ctx.beginPath();
          ctx.rect(pageXRef.current, pageYRef.current, x, y);
          ctx.fillStyle = "#80afe799";
          ctx.fill();
          movePageX.current = event.offsetX;
          movePageY.current = event.offsetY;
          // Xóa canvas trước khi vẽ lại
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
          // Xử lý selecting
          divCloneCanvasRef.current.style.width = Math.abs(x) + "px";
          divCloneCanvasRef.current.style.height = Math.abs(y) + "px";
          divCloneCanvasRef.current.style.top =
            positionTransformRef.current.y + "px";
          divCloneCanvasRef.current.style.left =
            positionTransformRef.current.x + "px";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [medias]
  );

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

  function isCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    if (
      rect1.left < rect2.left + rect2.width &&
      rect1.left + rect1.width > rect2.left &&
      rect1.top < rect2.top + rect2.height &&
      rect1.top + rect1.height > rect2.top
    ) {
      // Có va chạm
      return true;
    }

    // Không va chạm
    return false;
  }

  const getSelectedItems = (position = undefined) => {
    // Logic for determining selected items
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

  const handleClick = (event) => {
    event.preventDefault();
    const _this = event.currentTarget;
    let startItemChecked = getSelectedItems("start");
    let lastItemChecked = getSelectedItems("last");
    let listItemSelecting = getSelectedItems();
    if (!event.ctrlKey && !event.shiftKey) {
      if (listItemSelecting.length) {
        listItemSelecting.forEach((item) => {
          if (item !== _this) {
            item.firstElementChild.checked = false;
          }
        });
      }
      _this.firstElementChild.checked = !_this.firstElementChild.checked;
    } else if (event.ctrlKey) {
      if (_this.firstElementChild.checked) {
        _this.firstElementChild.checked = false;
      } else {
        _this.firstElementChild.checked = true;
      }
    } else if (event.shiftKey) {
      if (listItemSelecting.length) {
        _this.index = Number(_this.getAttribute("index"));
        /**
         * Kiểm tra đứt đoạn giữa start và last
         */

        let isIndexNotSeamless = null;
        for (let i = startItemChecked.index; i <= lastItemChecked.index; i++) {
          if (!listItemSelecting[i]) {
            isIndexNotSeamless = i - 1;
            break;
          }
        }
        if (_this.index >= lastItemChecked.index && !isIndexNotSeamless) {
          /**
           * target lớn hơn và không có đoạn đứt
           */
          let indexStart = lastItemChecked.index + 1;
          while (indexStart <= _this.index) {
            itemsRef.current[indexStart].firstElementChild.checked = true;
            indexStart++;
          }
        } else if (_this.index >= lastItemChecked.index && isIndexNotSeamless) {
          /**
           * target lớn hơn và có đoạn đứt thì lấy tất cả các item từ đoạn đứt kể ca chưa check cũng cho thành check
           */
          let indexStart = isIndexNotSeamless + 1;
          while (indexStart <= _this.index) {
            itemsRef.current[indexStart].firstElementChild.checked = true;
            indexStart++;
          }
        } else if (
          _this.index <= lastItemChecked.index &&
          _this.index >= startItemChecked.index &&
          !isIndexNotSeamless
        ) {
          for (
            let i = startItemChecked.index;
            i <= lastItemChecked.index;
            i++
          ) {
            listItemSelecting[i].firstElementChild.checked = i <= _this.index;
          }
        } else if (
          _this.index <= lastItemChecked.index &&
          _this.index >= startItemChecked.index &&
          isIndexNotSeamless
        ) {
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
          let indexStart = _this.index;
          while (indexStart <= startItemChecked.index) {
            itemsRef.current[indexStart].firstElementChild.checked = true;
            indexStart++;
          }
        }
      } else {
        Array.from(itemsRef.current)
          .filter((item, index) => index <= _this.index)
          .forEach((item) => (item.firstElementChild.checked = true));
      }
    }
  };

  const handleDoubleClick = (e, item) => {
    if (!isMultiple) {
      setChoosed(item);
    }
  };

  const loadMedias = useCallback(async () => {
    if (loadedPages.current.has(page)) return; // Nếu trang đã được tải, không làm gì cả
    setIsLoading(true);
    const posts = await fetchPosts(limitRef.current, page, {});
    setMedias((prevPosts) => {
      const allPosts = [...prevPosts, ...posts];
      // Lọc bài viết trùng dựa trên `id`
      return allPosts.filter(
        (post, index, self) =>
          self.findIndex((p) => p._id === post._id) === index
      );
    });
    loadedPages.current.add(page);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    loadMedias();
  }, [loadMedias]);

  useEffect(() => {
    if (!medias.length) return; // Không làm gì nếu danh sách trống

    // Chỉ gán observer khi có đủ 3 bài viết mới từ mỗi lần fetch
    const targetIndex = page * limitRef.current - 1; // Vị trí của tin thứ 3 từ mỗi lần fetch
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
  }, [medias, page]);

  const getFolder = async () => {
    const response = await getFolders({ media_id: null });
    setFolders(response.data);
  };

  useEffect(() => {
    getFolder();
  }, []);
  return (
    <>
      {folders && folders.length > 0 && (
        <div className="">
          <h3 className="mb-3 text-xl px-4 font-medium">Thư mục</h3>
          <div className="grid grid-cols-4 gap-4 p-4">
            {folders?.map((folder) => (
              <div
                key={folder._id}
                className={"col-span-1"}
                ref={(el) => {
                  if (
                    menuRefs.current.filter((menu) => menu.id != folder._id)
                  ) {
                    menuRefs.current.push({
                      id: folder._id,
                      el,
                    });
                  }
                }}
              >
                <div className="border rounded-lg p-4 cursor-pointer hover:shadow-2xl transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4 font-bold">
                    <FolderUpload />
                    <span>{folder.filename}</span>
                  </div>
                  <label
                    className="w-6 h-6 flex justify-center items-center cursor-pointer rounded-md hover:bg-gray-100 relative"
                    onClick={() => setOpenMenuIndex(folder._id)}
                  >
                    {openMenuIndex === folder._id && (
                      <div className="min-w-[150px] absolute top-full right-0 shadow-lg bg-white rounded-md">
                        <ul className="w-full p-2">
                          <li>
                            <button className="p-2 flex items-center gap-2 transition-all hover:bg-gray-200 w-full rounded-md">
                              <Open />
                              <span>Mở thư mục</span>
                            </button>
                          </li>
                          <li>
                            <button className="p-2 flex items-center gap-2 transition-all hover:bg-gray-200 w-full rounded-md">
                              <Edit />
                              <span>Sửa tên</span>
                            </button>
                          </li>
                          <li>
                            <button className="p-2 flex items-center gap-2 text-red-400 transition-all hover:bg-gray-200 w-full rounded-md">
                              <Trash />
                              <span>Xóa</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                    <Dot />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {medias && medias.length > 0 && (
        <div>
          <h3 className="mb-3 text-xl px-4 font-medium">Tệp tin</h3>
          <section
            ref={mediaItemRef}
            className="grid grid-cols-[repeat(auto-fill,minmax(calc(100%/12),1fr))] p-4 select-none bg-white gap-4 max-h-[calc(100%-140px)] overflow-auto file-selector"
            onMouseDown={handleMouseDown}
          >
            {medias?.map((media, index) => {
              let Component = mediaType[media.extention];
              if(!Component){
                Component = mediaType["default"];
              }
              return (
                <MediaItem
                  key={index}
                  {...media}
                  className="item has-[input:checked]:border-green-400 has-[input:checked]:border-2 border-2 border-transparent"
                  onClick={handleClick}
                  index={index}
                  onDoubleClick={(e) => handleDoubleClick(e, media)}
                >
                  <input type="checkbox" hidden />
                  <Component media={media} />
                </MediaItem>
              );
            })}
            <span ref={observerRef} className="w-full"></span>
          </section>
        </div>
      )}
      {isLoading && (
        <div className="text-center flex justify-center mb-[60px]">
          <svg
            className="text-gray-300 animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-900"
            ></path>
          </svg>
        </div>
      )}
    </>
  );
};

export default MediaList;
