"use client";
import { createContext, useEffect, useRef, useState } from "react";
import PreviewControl from "./PreviewControl";

export const PreviewContext = createContext();
// Key group là rs-group

/**
 * rs-preview
 * rs-preview-group
 * rs-preview-show
 */
const PreviewProvider = ({ key = "rs-preview", children, type = "follow" }) => {
  const [previewIndex, setPreviewIndex] = useState(null);
  const [images, setImages] = useState({});
  const groupIndexShowRef = useRef(null);
  const debounceObserver = useRef(null);
  useEffect(() => {
    // Hàm xử lý click
    const handleClick = (index, groupName) => {
      setPreviewIndex(index);
      groupIndexShowRef.current = groupName;
    };

    const changeDataImages = () => {
      setImages((prev) => {
        const listData = document.querySelectorAll(`[${key}]`);
        const imageGroup = {};
        for (let i = 0; i < listData.length; i++) {
          const groupName = listData[i].getAttribute(key);

          const images = listData[i].querySelectorAll("img[src]");
          if (!imageGroup[groupName]) {
            imageGroup[groupName] = [];
          }
          imageGroup[groupName] = Array.from(images).map((img) =>
            img.getAttribute("src")
          );

          const buttons = listData[i].querySelectorAll("[rs-preview-show]");
          for (let j = 0; j < buttons.length; j++) {
            const button = buttons[j];
            button.removeEventListener("click", () =>
              handleClick(j, groupName)
            );
            button.addEventListener("click", () => handleClick(j, groupName));
          }
        }
        return imageGroup;
      });
    };
    // Khởi tạo observer
    const observer = new MutationObserver(() => {
      clearTimeout(debounceObserver.current);
      // Cập nhật danh sách ảnh
      setTimeout(() => {
        changeDataImages();
      }, 400);
    });

    // Theo dõi toàn bộ body hoặc container chứa các phần tử cần quan sát
    const targetNode = document.body;
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, [key, setPreviewIndex, setImages]);

  return (
    <PreviewContext.Provider
      value={{
        previewIndex,
        setPreviewIndex,
        images,
        setImages,
        type,
        groupIndexShowRef,
      }}
    >
      {children}
      <PreviewControl />
    </PreviewContext.Provider>
  );
};

export default PreviewProvider;
