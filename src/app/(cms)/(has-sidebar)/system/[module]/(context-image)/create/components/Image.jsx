"use client";
import { GalleryContext } from "@/context/cms/ImageProvider";
import { useContext, useEffect, useId, useRef, useState } from "react";
import ImageCustom from "@/components/Maintain/Image";

const ImageComponent = ({ field, defaultValue }) => {
  const { setShowMedia, itemCurrent, isMultiple, choosed } =
    useContext(GalleryContext);
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();

  const handleShowUpload = () => {
    setIsLoading(true);
    setShowMedia(id);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setHasImage(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (imageRef.current) {
      imageRef.current.src = "/next.svg";
    }
  };

  useEffect(() => {
    if (isMultiple) return;
    const index = itemCurrent.findIndex((item) => item.id == id);
    if (index !== -1) {
      const imageData = itemCurrent[index]?.data;
      const imageUrl = imageData
        ? process.env.NEXT_PUBLIC_ENDPOINT_URL + imageData.url
        : "/next.svg";

      if (imageRef.current) {
        imageRef.current.src = imageUrl;
      }
      if (inputRef.current) {
        inputRef.current.value = JSON.stringify(imageData);
      }

      setCurrentImage(imageData);
      setHasImage(!!imageData);
      setIsLoading(false);
      setShowMedia(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosed]);

  // Set initial image state
  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = JSON.parse(defaultValue);
        if (parsed) {
          setHasImage(true);
        }
      } catch (e) {
        // Invalid JSON, keep hasImage as false
      }
    }
  }, [defaultValue]);

  return (
    <div className="relative max-w-xs mx-auto" id={id}>
      <div
        className={`
          group relative w-full h-48 cursor-pointer
          rounded-xl overflow-hidden border transition-all duration-200 ease-out
          ${
            hasImage
              ? "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
              : "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100"
          }
          ${isLoading ? "animate-pulse" : ""}
        `}
        onClick={handleShowUpload}
      >
        {/* Image Container */}
        <div className="relative w-full h-full p-2">
          <ImageCustom
            ref={imageRef}
            src="/next.svg"
            height={0}
            width={0}
            className={`
              w-full h-full object-contain rounded-lg transition-all duration-200
              ${hasImage ? "opacity-100" : "opacity-30"}
              group-hover:scale-[1.02]
            `}
            alt="Selected image"
          />

          {/* Gentle Overlay */}
          <div
            className={`
            absolute inset-2 rounded-lg bg-black transition-opacity duration-200
            ${hasImage ? "opacity-0 group-hover:opacity-10" : "opacity-0"}
          `}
          ></div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-2 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Upload Icon & Text (No Image) */}
          {!hasImage && !isLoading && (
            <div className="absolute inset-2 flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
              <svg
                className="w-8 h-8 mb-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-medium mb-0.5">Chọn ảnh</span>
              <span className="text-xs opacity-60">Click để tải lên</span>
            </div>
          )}

          {/* Compact Action Buttons (Has Image) */}
          {hasImage && !isLoading && (
            <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Change Image - Mini Button */}
              <button
                type="button"
                className="
                  p-1.5 bg-white hover:bg-gray-50 text-gray-600 
                  rounded-full shadow-sm hover:shadow-md
                  border border-gray-200 hover:border-gray-300
                  transition-all duration-150 transform hover:scale-110
                "
                onClick={handleShowUpload}
                title="Thay đổi ảnh"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </button>

              {/* Remove Image - Mini Button */}
              <button
                type="button"
                className="
                  p-1.5 bg-red-500 hover:bg-red-600 text-white 
                  rounded-full shadow-sm hover:shadow-md
                  transition-all duration-150 transform hover:scale-110
                "
                onClick={handleRemoveImage}
                title="Xóa ảnh"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Success Indicator */}
          {hasImage && (
            <div className="absolute bottom-3 left-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-200">
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Hidden Input */}
        <input
          type="text"
          ref={inputRef}
          name={field?.name}
          defaultValue={defaultValue || ""}
          hidden
        />
      </div>

      {/* Compact File Info */}
      {hasImage && currentImage && currentImage?.file_info && (
        <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-xs text-gray-600">
            <div className="font-medium truncate mb-0.5 text-gray-800">
              {currentImage.filename + currentImage.extention || "image.jpg"}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                {currentImage?.file_info
                  ? `${(
                      JSON.parse(currentImage?.file_info)?.["size"] / 1024
                    ).toFixed(1)} KB`
                  : "Size unknown"}
              </span>
              <span className="text-green-600 text-xs font-medium flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Uploaded
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
