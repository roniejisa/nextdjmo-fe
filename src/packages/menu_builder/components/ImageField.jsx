"use client";
import { ImageContext } from "@/context/cms/ImageProvider";
import { useContext, useEffect, useId, useRef } from "react";
import ImageCustom from "@/components/Maintain/Image";
import { Upload, Link2, Image as ImageIcon } from "lucide-react";

const ImageField = ({ field, value, onChange }) => {
  const { setShowMedia, itemCurrent, isMultiple, choosed, setItemCurrent } =
    useContext(ImageContext);

  const imageRef = useRef(null);
  const urlRef = useRef(null);
  const previousValueRef = useRef("");
  const id = useId();

  // Logic functions
  const handleShowUpload = () => {
    setShowMedia(id);
  };

  const checkHasIndex = (index) => {
    if (index !== -1) {
      const imageUrl = itemCurrent[index]?.data
        ? process.env.NEXT_PUBLIC_ENDPOINT_URL + itemCurrent[index]?.data.url
        : "/next.svg";

      imageRef.current.src = imageUrl;
      urlRef.current.value = imageUrl;
      previousValueRef.current = urlRef.current.value;
      setShowMedia(false);
    }
  };

  const handleBlur = (e) => {
    const currentValue = urlRef.current.value;
    if (currentValue !== previousValueRef.current) {
      imageRef.current.src = e.target.value;
      urlRef.current.value = imageRef.current.src;
      onChange(imageRef.current.src);
      previousValueRef.current = currentValue;
    }
  };

  // Effects
  useEffect(() => {
    let itemCurrent;
    try {
      itemCurrent = JSON.parse(value || "");
    } catch (e) {
      itemCurrent = null;
    }

    if (itemCurrent) {
      setItemCurrent((prev) => [...prev, { id, data: itemCurrent }]);
    } else if (value) {
      previousValueRef.current = value;
      urlRef.current.value = value;
      imageRef.current.src = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMultiple) return;
    const index = itemCurrent.findIndex((item) => item.id == id);
    checkHasIndex(index);

    if (index !== -1) {
      onChange(JSON.stringify(itemCurrent[index]?.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosed, itemCurrent]);

  return (
    <div
      id={id}
      className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 flex items-center gap-4"
    >
      {/* Image Preview Section */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-[130px] h-[130px] rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-blue-300 transition-colors duration-200">
            <ImageCustom
              ref={imageRef}
              src="/next.svg"
              height={120}
              width={120}
              className="w-full h-full object-contain p-2"
              alt="Preview"
            />
          </div>
          <div
            className="absolute cursor-pointer inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center"
            onClick={handleShowUpload}
          >
            <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
      </div>

      {/* URL Input Section */}
      <div className="w-full">
        <div className="relative">
          <label
            htmlFor={`url-${id}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <Link2 className="w-4 h-4 inline mr-2" />
            URL Hình ảnh
          </label>

          <input
            id={`url-${id}`}
            type="text"
            placeholder="Nhập link hoặc chọn ảnh từ thư viện"
            ref={urlRef}
            onBlur={handleBlur}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 focus:bg-white mb-3"
          />
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleShowUpload}
          className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
        >
          <Upload className="w-4 h-4 mr-2" />
          Chọn ảnh từ thư viện
        </button>
      </div>

      {/* Responsive breakpoint indicator (hidden, for development) */}
      <div className="sr-only">
        <span className="sm:hidden">Mobile</span>
        <span className="hidden sm:inline lg:hidden">Tablet</span>
        <span className="hidden lg:inline">Desktop</span>
      </div>
    </div>
  );
};

export default ImageField;
