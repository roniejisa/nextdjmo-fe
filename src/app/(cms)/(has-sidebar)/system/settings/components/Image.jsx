"use client";
import { ImageContext } from "@/context/cms/ImageProvider";
import { useContext, useEffect, useId, useRef } from "react";
import ImageCustom from "@/components/Maintain/Image";

const ImageComponent = ({ defaultValue, item, field }) => {
  const { setShowMedia, itemCurrent, setItemCurrent, choosed, isMultiple } =
    useContext(ImageContext);
  
  // Refs and ID
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  const id = useId();

  // Helper functions
  const getCurrentImage = () => itemCurrent.find((item) => item.id === id);
  
  const getImageSrc = () => {
    const current = getCurrentImage();
    return current?.data?.url 
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${current.data.url}`
      : "/next.svg";
  };

  const parseDefaultValue = (value) => {
    try {
      return JSON.parse(value || "");
    } catch {
      return null;
    }
  };

  // Event handlers
  const handleShowUpload = () => {
    setShowMedia(id);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    
    // Clear image src
    if (imageRef.current) {
      imageRef.current.src = "/next.svg";
    }
    
    // Clear input value - force multiple ways để chắc chắn
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.defaultValue = "";
      // Trigger change event để React biết
      const event = new Event('change', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
    
    // Remove from context
    setItemCurrent((prev) => prev.filter((item) => item.id !== id));
  };

  // Effects
  useEffect(() => {
    if (isMultiple) return;
    
    const index = itemCurrent.findIndex((item) => item.id === id);
    if (index !== -1) {
      const currentItem = itemCurrent[index];
      
      if (imageRef.current) {
        imageRef.current.src = currentItem?.data?.url
          ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${currentItem.data.url}`
          : "/next.svg";
      }
      
      if (inputRef.current) {
        inputRef.current.value = JSON.stringify(currentItem?.data || {});
      }
      
      setShowMedia(false);
    }
  }, [itemCurrent, choosed, id, isMultiple, setShowMedia]);

  useEffect(() => {
    const parsedValue = parseDefaultValue(defaultValue);
    
    if (parsedValue) {
      setItemCurrent((prev) => [...prev, { id, data: parsedValue }]);
    }
  }, [id, defaultValue, setItemCurrent]);

  // Render components
  const renderImage = () => (
    <ImageCustom
      ref={imageRef}
      src={getImageSrc()}
      height={0}
      width={0}
      className="absolute inset-0 w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
      alt={item?.name || item?.username || "Uploaded image"}
    />
  );

  const renderHiddenInput = () => (
    <input
      type="text"
      autoComplete="off"
      ref={inputRef}
      name={field.name}
      defaultValue={defaultValue || ""}
      hidden
      aria-hidden="true"
    />
  );

  const renderOverlay = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl backdrop-blur-[2px]" />
  );

  const renderRemoveButton = () => {
    const hasImage = getCurrentImage()?.data?.url;
    
    if (!hasImage) return null;
    
    return (
      <button
        type="button"
        onClick={handleRemoveImage}
        className="
          absolute top-2 right-2 z-30
          w-8 h-8 rounded-full
          bg-red-500/90 hover:bg-red-600 text-white
          opacity-0 group-hover:opacity-100
          transform hover:scale-110 active:scale-95
          transition-all duration-300 ease-out
          shadow-lg hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-transparent
          backdrop-blur-sm border border-red-400/30
        "
        aria-label="Xóa ảnh"
        title="Xóa ảnh"
      >
        <svg 
          className="w-4 h-4 mx-auto" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    );
  };

  const renderUploadButton = () => {
    const hasImage = getCurrentImage()?.data?.url;
    
    return (
      <button
        type="button"
        onClick={handleShowUpload}
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
          opacity-0 group-hover:opacity-100
          px-6 py-3 rounded-lg
          bg-white/90 hover:bg-white text-gray-800 font-medium
          border border-white/20 hover:border-white/40
          backdrop-blur-sm
          transform hover:scale-105 active:scale-95
          transition-all duration-300 ease-out
          shadow-lg hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
        "
        aria-label={hasImage ? "Thay đổi ảnh" : "Chọn ảnh để tải lên"}
      >
        <span className="flex items-center gap-2">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {hasImage ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            )}
          </svg>
          {hasImage ? "Thay đổi" : "Chọn ảnh"}
        </span>
      </button>
    );
  };

  const renderImageContainer = () => (
    <div className="
      group relative
      w-full aspect-square max-w-[280px] mx-auto
      sm:max-w-[320px] md:max-w-[200px] lg:max-w-[240px]
      rounded-xl overflow-hidden
      bg-gradient-to-br from-gray-50 to-gray-100
      border-2 border-gray-200/50 hover:border-gray-300/70
      shadow-lg hover:shadow-2xl
      transform hover:-translate-y-1 hover:rotate-[0.5deg]
      transition-all duration-500 ease-out
      cursor-pointer
      before:absolute before:inset-0 before:rounded-xl
      before:bg-gradient-to-br before:from-white/20 before:to-transparent
      before:opacity-0 before:transition-opacity before:duration-300
      hover:before:opacity-100
    ">
      {renderImage()}
      {renderOverlay()}
      {renderRemoveButton()}
      {renderUploadButton()}
      
      {/* 3D effect shadow */}
      <div className="
        absolute -inset-1 -z-10
        bg-gradient-to-br from-gray-200/50 to-gray-400/50
        rounded-xl blur-sm
        opacity-0 group-hover:opacity-100
        transition-all duration-500
        transform translate-y-1 translate-x-1
      " />
    </div>
  );

  return (
    <div className="
      relative p-4 rounded-2xl
      bg-gradient-to-br from-white to-gray-50/50
      border border-gray-200/30
      shadow-sm hover:shadow-md
      transition-all duration-300
    ">
      {renderImageContainer()}
      {renderHiddenInput()}
      
      {/* Optional: Status indicator */}
      <div className="absolute -top-2 -right-2 z-30">
        <div className={`
          w-3 h-3 rounded-full border-2 border-white
          shadow-sm transition-colors duration-300
          ${getCurrentImage()?.data ? 'bg-green-500' : 'bg-gray-300'}
        `} />
      </div>
    </div>
  );
};

export default ImageComponent;