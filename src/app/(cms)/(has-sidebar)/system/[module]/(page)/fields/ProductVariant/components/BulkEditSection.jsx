"use client"

import { formatNumber } from "../utils";

const BulkEditSection = ({
  handleSelectAll,
  selectedItems,
  data,
  handleBulkEdit,
  showBulkEdit,
  setBulkEditData,
  setShowBulkEdit,
  bulkEditData,
  applyBulkEdit,
  generateAllSKUs
}) => {
  // Hàm để loại bỏ format và chỉ lấy số
  const parseFormattedNumber = (formattedString) => {
    if (!formattedString) return "";
    // Loại bỏ tất cả dấu phẩy và ký tự không phải số
    return formattedString.toString().replace(/[^0-9]/g, "");
  };

  // Hàm xử lý thay đổi giá trong bulk edit
  const handleBulkPriceChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFormattedNumber(inputValue);
    
    setBulkEditData((prev) => ({
      ...prev,
      price: numericValue, // Lưu giá trị số thuần túy
    }));
  };

  // Hàm xử lý thay đổi stock trong bulk edit
  const handleBulkStockChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFormattedNumber(inputValue);
    
    setBulkEditData((prev) => ({
      ...prev,
      stock: numericValue, // Lưu giá trị số thuần túy
    }));
  };

  return (
    <div className="mt-4 mb-4 p-6 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-slate-100/80 to-slate-200/60 hover:from-slate-200/80 hover:to-slate-300/60 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200 text-slate-700"
        >
          {selectedItems.size === data.length
            ? "Bỏ chọn tất cả"
            : "Chọn tất cả"}
        </button>
        
        <button
          type="button"
          onClick={handleBulkEdit}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-blue-500/90 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/80 disabled:from-gray-400/60 disabled:to-gray-500/50 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] disabled:shadow-[2px_2px_4px_rgba(0,0,0,0.1)] transform hover:scale-95 disabled:scale-100 transition-all duration-200 text-white disabled:text-gray-300 disabled:cursor-not-allowed"
          disabled={selectedItems.size === 0}
        >
          Chỉnh sửa hàng loạt ({selectedItems.size})
        </button>
        
        <button
          type="button"
          onClick={generateAllSKUs}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-emerald-500/90 to-emerald-600/80 hover:from-emerald-600/90 hover:to-emerald-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-95 transition-all duration-200 text-white"
        >
          Tạo SKU tự động
        </button>
      </div>

      {showBulkEdit && (
        <div className="border-t border-white/20 pt-4 relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm">
                Giá
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bulkEditData.price ? formatNumber(bulkEditData.price) : ""}
                  onChange={handleBulkPriceChange}
                  className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Nhập giá mới"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-slate-500">₫</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm">
                Kho hàng
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bulkEditData.stock ? formatNumber(bulkEditData.stock) : ""}
                  onChange={handleBulkStockChange}
                  className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Nhập số lượng mới"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-slate-500">sp</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm">
                SKU (tiền tố)
              </label>
              <input
                type="text"
                value={bulkEditData.sku || ""}
                onChange={(e) =>
                  setBulkEditData((prev) => ({
                    ...prev,
                    sku: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                placeholder="Nhập SKU mới"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={applyBulkEdit}
              className="px-6 py-2 font-medium rounded-xl bg-gradient-to-br from-blue-500/90 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-95 transition-all duration-200 text-white"
            >
              Áp dụng
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowBulkEdit(false);
                setBulkEditData({ price: "", stock: "", sku: "" });
              }}
              className="px-6 py-2 font-medium rounded-xl bg-gradient-to-br from-slate-100/80 to-slate-200/60 hover:from-slate-200/80 hover:to-slate-300/60 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200 text-slate-700"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkEditSection;