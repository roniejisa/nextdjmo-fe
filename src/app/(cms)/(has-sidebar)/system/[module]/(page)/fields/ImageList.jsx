"use client";
import { useEffect, useRef } from "react";
import ImageCustom from "@/components/Maintain/Image";
import { useImageStore } from "@/stories/files/imageStore";

const ImageListComponent = ({ value, item, field }) => {
  const {
    setShowMedia,
    fileCurrent,
    listImageChoosed,
    setIsMultiple,
    setFileCurrent,
  } = useImageStore((state) => state);

  const textareaRef = useRef(null);
  // Sử dụng field.name làm ID thay vì useId() để đảm bảo consistency
  const id = field.name;

  const handleShowUpload = () => {
    setShowMedia(id);
    setIsMultiple(true);
  };

  // Effect để xử lý khi fileCurrent thay đổi
  useEffect(() => {
    const currentFile = fileCurrent.find((item) => item.id === id);
    if (currentFile && textareaRef.current) {
      textareaRef.current.value = JSON.stringify(currentFile.items || []);
      setIsMultiple(false);
      setShowMedia(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileCurrent, listImageChoosed, id]); // Thêm id vào dependency

  // Effect để khởi tạo dữ liệu từ value prop
  useEffect(() => {
    if (!value) return;

    let images = null;
    try {
      images = JSON.parse(value);
    } catch (e) {
      console.error("Error parsing value:", e);
      return;
    }

    if (Array.isArray(images) && images.length > 0) {
      setFileCurrent((prev) => {
        const newState = [...prev];
        const index = newState.findIndex((item) => item.id === id);

        if (index !== -1) {
          // Cập nhật existing item
          newState[index] = {
            ...newState[index],
            items: [...images],
          };
        } else {
          // Thêm item mới
          newState.push({ id: id, items: [...images] });
        }

        return newState;
      });
    }
  }, [value, id, setFileCurrent]);

  const deleteItem = (idItem) => {
    setFileCurrent((prev) => {
      const newState = [...prev];
      const index = newState.findIndex((item) => item.id === id);

      if (index !== -1) {
        const currentItems = newState[index].items || [];
        const newItems = currentItems.filter(
          (fileCurrent) => fileCurrent._id !== idItem
        );

        newState[index] = {
          ...newState[index],
          items: newItems,
        };

        // Cập nhật textarea
        if (textareaRef.current) {
          textareaRef.current.value = JSON.stringify(newItems);
        }
      }

      return newState;
    });
  };

  // Lấy current file data - nếu không tìm thấy theo ID, thử tìm theo value
  let currentFileData = fileCurrent.find((item) => item.id === id);

  // Fallback: nếu không tìm thấy theo ID và có value, parse value để hiển thị
  if (!currentFileData && value) {
    try {
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue) && parsedValue.length > 0) {
        currentFileData = { id, items: parsedValue };
      }
    } catch (e) {
      console.error("Error parsing value for fallback:", e);
    }
  }

  const currentImages = currentFileData?.items || [];

  return (
    <div className="relative" rs-preview={field.name}>
      <div className="p-6 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        <div className="relative z-10">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {/* Render images - sử dụng currentImages thay vì testImages */}
            {currentImages.length > 0 &&
              currentImages.map((item, index) => (
                <div
                  className="relative rounded-xl overflow-hidden group backdrop-blur-sm bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] p-3 transition-all duration-300 hover:scale-105"
                  key={`${id}-${item._id || index}`}
                >
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <ImageCustom
                      src={
                        item?.url
                          ? process.env.NEXT_PUBLIC_ENDPOINT_URL + item.url
                          : "/next.svg"
                      }
                      fill={true}
                      sizes="100vw"
                      style={{
                        objectFit: "contain",
                      }}
                      className="rounded-lg"
                      alt={item?.alt || ""}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 rounded-lg"></div>
                  </div>

                  <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 justify-center group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                    <button
                      className="p-2 rounded-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 shadow-[2px_2px_4px_rgba(0,0,0,0.2),-1px_-1px_2px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-slate-600 hover:text-slate-800 transition-all duration-200 hover:scale-95"
                      type="button"
                      rs-preview-show={"true"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                      </svg>
                    </button>

                    <button
                      className="p-2 rounded-xl bg-gradient-to-br from-red-500/90 to-red-600/80 backdrop-blur-sm border border-white/40 shadow-[2px_2px_4px_rgba(0,0,0,0.2),-1px_-1px_2px_rgba(255,255,255,0.3)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.4)] text-white hover:text-red-100 transition-all duration-200 hover:scale-95"
                      onClick={() => deleteItem(item._id)}
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

            {/* Add button */}
            <button
              type="button"
              className="h-40 rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/60 to-white/30 border-2 border-dashed border-white/50 hover:border-blue-400/60 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] text-slate-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              onClick={handleShowUpload}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Chọn ảnh
            </button>
          </div>
        </div>

        <textarea
          type="text"
          ref={textareaRef}
          name={field.name}
          defaultValue={value || ""}
          hidden
        />
      </div>
    </div>
  );
};

export default ImageListComponent;
