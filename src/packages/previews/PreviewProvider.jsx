"use client";
import { createContext, useEffect, useRef, useState } from "react";
import PreviewControl from "./PreviewControl";

export const PreviewContext = createContext();
const PreviewProvider = ({ key = "rs-preview", children, type = "follow" }) => {
  const [previewIndex, setPreviewIndex] = useState(null);
  const [images, setImages] = useState([]);
  useEffect(() => {
    // Hàm xử lý click
    const handleClick = (item, list) => {
      setPreviewIndex(list.indexOf(item.getAttribute("src")));
    };

    // Khởi tạo observer
    const observer = new MutationObserver(() => {
      const listData = document.querySelectorAll(`[${key}]`);
      const list = Array.from(listData).map((item) => item.getAttribute("src"));

      // Cập nhật danh sách ảnh
      setImages(list);

      // Gắn sự kiện click
      listData.forEach((item) => {
        item.removeEventListener("click", () => handleClick(item, list)); // Xóa sự kiện cũ
        item.addEventListener("click", () => handleClick(item, list)); // Gắn sự kiện mới
      });
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
      }}
    >
      {children}
      <PreviewControl />
    </PreviewContext.Provider>
  );
};

export default PreviewProvider;
