"use client"
import React from "react";
import ImageComponent from "./Image";
const RenderVariantTable = ({
  listAttribute,
  data,
  toggleAllGroups,
  collapsedGroups,
  groupedData,
  selectedItems,
  filteredData,
  setSelectedItems,
  selectGroup,
  toggleGroupCollapse,
  handleSelectItem,
  changeData,
  attributeFilters,
  bulkEditMode,
  generateAllSKUs,
  showAdvancedBulkEdit,
  oldValue,
  firstAttributeLength,
  upImageForData,
  setShowAdvancedBulkEdit,
  bulkEditData,
  setBulkEditData,
  handleAdvancedBulkEdit,
  setAttributeFilters,
  setBulkEditMode
}) => {
  if (!listAttribute.length || !data.length) return null;

  return (
    <div className="mt-4">
      {/* Bộ lọc nâng cao */}
      <div className="mb-4 p-4 border rounded-md bg-gray-50">
        <div className="flex items-center gap-4 mb-3">
          <h4 className="font-medium">Bộ lọc và chỉnh sửa nâng cao:</h4>
          <button
            type="button"
            onClick={toggleAllGroups}
            className="px-3 py-1 border rounded text-sm"
          >
            {collapsedGroups.size === Object.keys(groupedData).length
              ? "Mở tất cả"
              : "Thu gọn tất cả"}
          </button>
        </div>

        {/* Bộ lọc theo thuộc tính */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {listAttribute.map((attr) => (
            <div key={attr.name}>
              <label className="block text-sm font-medium mb-1">
                {attr.name}
              </label>
              <select
                value={attributeFilters[attr.name] || ""}
                onChange={(e) =>
                  setAttributeFilters((prev) => ({
                    ...prev,
                    [attr.name]: e.target.value,
                  }))
                }
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Tất cả</option>
                {attr.values
                  .filter((v) => v.value)
                  .map((value) => (
                    <option key={value.id} value={value.value}>
                      {value.value}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>

        {/* Chỉnh sửa hàng loạt nâng cao */}
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Áp dụng cho:
            </label>
            <select
              value={bulkEditMode}
              onChange={(e) => setBulkEditMode(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="selected">Đã chọn ({selectedItems.size})</option>
              <option value="filtered">Đã lọc ({filteredData.length})</option>
              <option value="all">Tất cả ({data.length})</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedBulkEdit(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded text-sm"
          >
            Chỉnh sửa nâng cao
          </button>
          <button
            type="button"
            onClick={generateAllSKUs}
            className="px-4 py-2 bg-green-500 text-white rounded text-sm"
          >
            Tạo SKU tự động
          </button>
        </div>

        {/* Modal chỉnh sửa nâng cao */}
        {showAdvancedBulkEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">
                Chỉnh sửa hàng loạt nâng cao
              </h3>
              <div className="space-y-4">
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
                  <label className="block text-sm font-medium mb-1">
                    Kho hàng
                  </label>
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
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleAdvancedBulkEdit}
                  className="px-4 py-2 bg-purple-500 text-white rounded"
                >
                  Áp dụng
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedBulkEdit(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bảng dữ liệu với tính năng thu gọn */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-center border p-2 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.size === filteredData.length &&
                    filteredData.length > 0
                  }
                  onChange={() => {
                    if (selectedItems.size === filteredData.length) {
                      setSelectedItems(new Set());
                    } else {
                      const newSelected = new Set();
                      filteredData.forEach((_, index) => {
                        const originalIndex = data.findIndex(
                          (item) => item === filteredData[index]
                        );
                        newSelected.add(originalIndex);
                      });
                      setSelectedItems(newSelected);
                    }
                  }}
                />
              </th>
              <th className="text-center border p-2 w-16">Nhóm</th>
              {listAttribute.map((item, index) => (
                <th key={index} className="text-center border p-2 min-w-32">
                  {item.name}
                </th>
              ))}
              <th className="text-center border p-2 w-24">Giá</th>
              <th className="text-center border p-2 w-24">Kho</th>
              <th className="text-center border p-2 w-32">SKU</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([groupKey, groupItems]) => {
              const isCollapsed = collapsedGroups.has(groupKey);
              const isGroupSelected = groupItems.every((item) =>
                selectedItems.has(item.originalIndex)
              );

              return (
                <React.Fragment key={groupKey}>
                  {/* Header row cho nhóm */}
                  <tr className="bg-gray-100">
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={isGroupSelected}
                        onChange={() => selectGroup(groupKey)}
                      />
                    </td>
                    <td className="border p-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleGroupCollapse(groupKey)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {isCollapsed ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </button>
                        <span className="font-medium">{groupKey}</span>
                        <span className="text-sm text-gray-500">
                          ({groupItems.length})
                        </span>
                      </div>
                    </td>
                    <td
                      colSpan={listAttribute.length + 3}
                      className="border p-2 text-sm text-gray-500"
                    >
                      {isCollapsed ? "Nhấn để mở rộng" : "Nhấn để thu gọn"}
                    </td>
                  </tr>

                  {/* Các hàng dữ liệu trong nhóm */}
                  {!isCollapsed &&
                    groupItems.map((item) => {
                      const index = item.originalIndex;
                      return (
                        <tr
                          key={index}
                          className={
                            selectedItems.has(index)
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="border p-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(index)}
                              onChange={() => handleSelectItem(index)}
                            />
                          </td>
                          <td className="border p-2"></td>
                          {listAttribute.map((attr, indexAttr) => {
                            const countId = data.reduce(
                              (acc, current) => {
                                if (!acc.id) {
                                  acc.id = current.id;
                                } else if (acc.id !== current.id) {
                                  acc.total++;
                                }
                                return acc;
                              },
                              {
                                total: 1,
                              }
                            ).total;

                            const isSingleFirst =
                              countId == 1 && indexAttr == 0 && index == 0;
                            const firstInit =
                              (oldValue.current != item.id ||
                                !oldValue.current) &&
                              indexAttr == 0 &&
                              listAttribute.length > 1;
                            if (firstInit || isSingleFirst) {
                              oldValue.current = item.id;

                              return (
                                <td
                                  key={"" + index + "." + indexAttr}
                                  className="border p-2 text-center"
                                  rowSpan={firstAttributeLength.current}
                                >
                                  {item[attr.name]}
                                  <ImageComponent
                                    value={item?.image}
                                    fnChooseImage={upImageForData}
                                    attrName={attr.name}
                                    attrValue={item[attr.name]}
                                  />
                                </td>
                              );
                            } else if (
                              indexAttr == 0 &&
                              listAttribute.length > 1
                            ) {
                              return (
                                <React.Fragment
                                  key={"" + index + "." + indexAttr}
                                ></React.Fragment>
                              );
                            } else if (indexAttr == 0) {
                              return (
                                <td
                                  key={"" + index + "." + indexAttr}
                                  className="border p-2"
                                >
                                  {item[attr.name]}
                                  <ImageComponent
                                    value={item?.image}
                                    fnChooseImage={upImageForData}
                                    attrName={attr.name}
                                    attrValue={item[attr.name]}
                                  />
                                </td>
                              );
                            } else {
                              return (
                                <td
                                  key={"" + index + "." + indexAttr}
                                  className="border p-2"
                                >
                                  {item[attr.name]}
                                </td>
                              );
                            }
                          })}
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item?.price}
                              className="w-full outline-outline outline-4 transition border rounded-md p-2"
                              onChange={(e) => changeData(e, index, "price")}
                              placeholder="Nhập giá"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item?.stock}
                              className="w-full outline-outline outline-4 transition border rounded-md p-2"
                              onChange={(e) => changeData(e, index, "stock")}
                              placeholder="Nhập số lượng"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item?.sku}
                              className="w-full outline-outline outline-4 transition border rounded-md p-2"
                              onChange={(e) => changeData(e, index, "sku")}
                              placeholder="Nhập SKU"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RenderVariantTable;
