"use client"

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
  return (
    <div className="mt-4 mb-4 p-4 border rounded-md bg-gray-50">
      <div className="flex items-center gap-4 mb-3">
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-3 py-1 border rounded text-sm"
        >
          {selectedItems.size === data.length
            ? "Bỏ chọn tất cả"
            : "Chọn tất cả"}
        </button>
        <button
          type="button"
          onClick={handleBulkEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          disabled={selectedItems.size === 0}
        >
          Chỉnh sửa hàng loạt ({selectedItems.size})
        </button>
        <button
          type="button"
          onClick={generateAllSKUs}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Tạo SKU tự động
        </button>
      </div>

      {showBulkEdit && (
        <div className="border-t pt-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giá</label>
              <input
                type="text"
                value={bulkEditData.price}
                onChange={(e) =>
                  setBulkEditData((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="w-full border rounded p-2"
                placeholder="Nhập giá mới"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kho hàng</label>
              <input
                type="text"
                value={bulkEditData.stock}
                onChange={(e) =>
                  setBulkEditData((prev) => ({
                    ...prev,
                    stock: e.target.value,
                  }))
                }
                className="w-full border rounded p-2"
                placeholder="Nhập số lượng mới"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                SKU (tiền tố)
              </label>
              <input
                type="text"
                value={bulkEditData.sku}
                onChange={(e) =>
                  setBulkEditData((prev) => ({
                    ...prev,
                    sku: e.target.value,
                  }))
                }
                className="w-full border rounded p-2"
                placeholder="Nhập SKU mới"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={applyBulkEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBulkEdit(false);
                setBulkEditData({ price: "", stock: "", sku: "" });
              }}
              className="px-4 py-2 border rounded"
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
