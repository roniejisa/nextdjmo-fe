"use client";

import { formatNumber } from "../utils";

const NoVariant = ({
  data,
  handleChangePrice,
  handleChangeSku,
  changeStock,
}) => {
  // Hàm để loại bỏ format và chỉ lấy số
  const parseFormattedNumber = (formattedString) => {
    if (!formattedString) return "";
    // Loại bỏ tất cả dấu phẩy và ký tự không phải số
    return formattedString.toString().replace(/[^0-9]/g, "");
  };

  // Hàm xử lý thay đổi giá
  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFormattedNumber(inputValue);
    
    // Tạo event mới với giá trị số thuần túy
    const modifiedEvent = {
      ...e,
      target: {
        ...e.target,
        value: numericValue, // Giá trị số thuần túy không có dấu phẩy
        'data-name': 'price'
      }
    };
    
    handleChangePrice(modifiedEvent);
  };

  // Hàm xử lý thay đổi stock
  const handleStockChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFormattedNumber(inputValue);
    
    // Tạo event mới với giá trị số thuần túy
    const modifiedEvent = {
      ...e,
      target: {
        ...e.target,
        value: numericValue, // Giá trị số thuần túy không có dấu phẩy
        'data-name': 'stock'
      }
    };
    
    changeStock(modifiedEvent);
  };

  return (
    <div className="mt-4 p-6 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-slate-700 drop-shadow-sm mb-6">
          Thông tin sản phẩm đơn giản
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm">
              Giá bán
            </label>
            <div className="relative">
              <input
                type="text"
                data-name="price"
                value={data[0] && data[0]?.price ? formatNumber(data[0]?.price) : ""}
                placeholder="Nhập giá bán (VNĐ)"
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400 font-medium"
                onChange={handlePriceChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-sm text-slate-500 font-medium">₫</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm">
              Số lượng tồn kho
            </label>
            <div className="relative">
              <input
                type="text"
                data-name="stock"
                value={data[0] && data[0]?.stock ? formatNumber(data[0]?.stock) : "0"}
                placeholder="Nhập số lượng"
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400 font-medium"
                onChange={handleStockChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-sm text-slate-500 font-medium">sp</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm">
              Mã SKU
            </label>
            <input
              type="text"
              data-name="sku"
              value={data[0] ? data[0]?.sku : ""}
              placeholder="Nhập mã SKU"
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400 font-medium"
              onChange={handleChangeSku}
            />
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-blue-100/40 backdrop-blur-sm border border-blue-200/30 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div className="text-sm text-blue-700/80">
              <p className="font-semibold mb-1">Chế độ sản phẩm đơn giản</p>
              <p className="text-blue-600/70">
                Sản phẩm không có phân loại (variant). Thích hợp cho sản phẩm có
                một loại duy nhất hoặc không cần phân biệt theo thuộc tính.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoVariant;