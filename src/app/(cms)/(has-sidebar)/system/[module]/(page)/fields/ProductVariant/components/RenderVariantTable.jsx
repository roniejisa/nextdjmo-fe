"use client";
import React from "react";
import ImageComponent from "./Image";
import { formatNumber } from "../utils";

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
  setBulkEditMode,
}) => {
  // Hàm xử lý khi thay đổi giá trị input số
  const handleNumberChange = (e, index, field) => {
    const inputValue = e.target.value;
    // Loại bỏ dấu phấy để lấy giá trị số thực
    const numericValue = inputValue.replace(/,/g, "");

    // Tạo event mới với giá trị số thực
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: numericValue,
      },
    };

    changeData(newEvent, index, field);
  };

  if (!listAttribute.length || !data.length) return null;

  return (
    <div className="">
      {/* Bộ lọc nâng cao */}
      <div className="mb-6 p-6 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <h4 className="font-semibold text-slate-700 text-lg drop-shadow-sm">
            Bộ lọc và chỉnh sửa nâng cao:
          </h4>
          <button
            type="button"
            onClick={toggleAllGroups}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-slate-100/80 to-slate-200/60 hover:from-slate-200/80 hover:to-slate-300/60 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200 text-slate-700"
          >
            {collapsedGroups.size === Object.keys(groupedData).length
              ? "Mở tất cả"
              : "Thu gọn tất cả"}
          </button>
        </div>

        {/* Bộ lọc theo thuộc tính */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 relative z-10">
          {listAttribute.map((attr) => (
            <div key={attr.name}>
              <label className="block text-sm font-semibold mb-2 text-slate-700 drop-shadow-sm">
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
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700"
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
        <div className="flex items-end gap-4 relative z-10">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 drop-shadow-sm">
              Áp dụng cho:
            </label>
            <select
              value={bulkEditMode}
              onChange={(e) => setBulkEditMode(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700"
            >
              <option value="selected">Đã chọn ({selectedItems.size})</option>
              <option value="filtered">Đã lọc ({filteredData.length})</option>
              <option value="all">Tất cả ({data.length})</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedBulkEdit(true)}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-blue-500/90 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-95 transition-all duration-200 text-white"
          >
            Chỉnh sửa nâng cao
          </button>
          <button
            type="button"
            onClick={generateAllSKUs}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-emerald-500/90 to-emerald-600/80 hover:from-emerald-600/90 hover:to-emerald-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-95 transition-all duration-200 text-white"
          >
            Tạo SKU tự động
          </button>
        </div>

      </div>
      {/* Modal chỉnh sửa nâng cao */}
      {showAdvancedBulkEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="p-8 rounded-3xl max-w-md w-full mx-4 relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 border border-white/30 shadow-[20px_20px_40px_rgba(0,0,0,0.15),-10px_-10px_30px_rgba(255,255,255,0.8)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none">
            <h3 className="text-xl font-semibold mb-6 text-slate-700 drop-shadow-sm relative z-10">
              Chỉnh sửa hàng loạt nâng cao
            </h3>
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 drop-shadow-sm">
                  Giá
                </label>
                <input
                  type="text"
                  value={formatNumber(bulkEditData.price)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/,/g, "");
                    setBulkEditData((prev) => ({
                      ...prev,
                      price: numericValue,
                    }));
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Nhập giá mới"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 drop-shadow-sm">
                  Kho hàng
                </label>
                <input
                  type="text"
                  value={formatNumber(bulkEditData.stock)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/,/g, "");
                    setBulkEditData((prev) => ({
                      ...prev,
                      stock: numericValue,
                    }));
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Nhập số lượng mới"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 drop-shadow-sm">
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
                  className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Nhập SKU mới"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8 relative z-10">
              <button
                type="button"
                onClick={handleAdvancedBulkEdit}
                className="px-6 py-2 font-medium rounded-xl bg-gradient-to-br from-blue-500/90 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-95 transition-all duration-200 text-white"
              >
                Áp dụng
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedBulkEdit(false)}
                className="px-6 py-2 font-medium rounded-xl bg-gradient-to-br from-slate-100/80 to-slate-200/60 hover:from-slate-200/80 hover:to-slate-300/60 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200 text-slate-700"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bảng dữ liệu với tính năng thu gọn */}
      <div className="rounded-2xl overflow-hidden relative backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        <table className="w-full relative z-10">
          <thead className="bg-gradient-to-r from-slate-200/80 to-slate-300/60 backdrop-blur-sm border-b border-white/20">
            <tr>
              <th className="text-center p-4 w-12">
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
                  className="w-5 h-5 rounded-md bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] appearance-none checked:bg-gradient-to-r checked:from-blue-500 checked:to-blue-600 checked:shadow-[inset_2px_2px_4px_rgba(59,130,246,0.3),inset_-2px_-2px_4px_rgba(59,130,246,0.1)] transition-all duration-200"
                />
              </th>
              <th className="text-center p-4 w-16 font-semibold text-slate-700 drop-shadow-sm">
                Nhóm
              </th>
              {listAttribute.map((item, index) => (
                <th
                  key={index}
                  className={`text-center p-4 font-semibold text-slate-700 drop-shadow-sm ${
                    index === 0 && item.name.toLowerCase().includes("màu")
                      ? "w-20" // Cột đầu tiên (chứa ảnh) nhỏ hơn
                      : "w-24" // Các cột attribute khác
                  }`}
                >
                  {item.name}
                </th>
              ))}
              <th className="text-center p-4 w-36 font-semibold text-slate-700 drop-shadow-sm">
                Giá
              </th>
              <th className="text-center p-4 w-36 font-semibold text-slate-700 drop-shadow-sm">
                Kho
              </th>
              <th className="text-center p-4 w-40 font-semibold text-slate-700 drop-shadow-sm">
                SKU
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([groupKey, groupItems]) => {
              const isCollapsed = collapsedGroups.has(groupKey);
              const isGroupSelected = groupItems.every((item) =>
                selectedItems.has(item.originalIndex)
              );

              // Reset oldValue khi bắt đầu render nhóm mới
              if (!isCollapsed) {
                oldValue.current = null;
              }

              return (
                <React.Fragment key={groupKey}>
                  {/* Header row cho nhóm */}
                  <tr className="bg-gradient-to-r from-slate-150/60 to-slate-200/40 backdrop-blur-sm border-b border-white/10">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isGroupSelected}
                        onChange={() => selectGroup(groupKey)}
                        className="w-5 h-5 rounded-md bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] appearance-none checked:bg-gradient-to-r checked:from-blue-500 checked:to-blue-600 checked:shadow-[inset_2px_2px_4px_rgba(59,130,246,0.3),inset_-2px_-2px_4px_rgba(59,130,246,0.1)] transition-all duration-200"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleGroupCollapse(groupKey)}
                          className="p-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200"
                        >
                          {isCollapsed ? (
                            <svg
                              className="w-4 h-4 text-slate-600"
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
                              className="w-4 h-4 text-slate-600"
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
                        <span className="font-semibold text-slate-700 drop-shadow-sm">
                          {groupKey}
                        </span>
                        <span className="text-sm text-slate-500 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 px-2 py-1 rounded-lg shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]">
                          ({groupItems.length})
                        </span>
                      </div>
                    </td>
                    <td
                      colSpan={listAttribute.length + 3}
                      className="p-3 text-sm text-slate-500 font-medium drop-shadow-sm"
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
                              ? "bg-gradient-to-r from-blue-100/60 to-blue-200/40 backdrop-blur-sm border-b border-white/10 shadow-[inset_1px_1px_2px_rgba(59,130,246,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]"
                              : "hover:bg-gradient-to-r hover:from-slate-50/40 hover:to-slate-100/30 hover:backdrop-blur-sm border-b border-white/5 hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] transition-all duration-200"
                          }
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(index)}
                              onChange={() => handleSelectItem(index)}
                              className="w-5 h-5 rounded-md bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] appearance-none checked:bg-gradient-to-r checked:from-blue-500 checked:to-blue-600 checked:shadow-[inset_2px_2px_4px_rgba(59,130,246,0.3),inset_-2px_-2px_4px_rgba(59,130,246,0.1)] transition-all duration-200"
                            />
                          </td>
                          <td className="p-3"></td>
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
                              (oldValue.current !== item.id ||
                                !oldValue.current) &&
                              indexAttr == 0 &&
                              listAttribute.length > 1;
                            if (firstInit || isSingleFirst) {
                              oldValue.current = item.id;
                              const currentGroupItems = groupItems.filter(
                                (groupItem) =>
                                  data[groupItem.originalIndex].id === item.id
                              );
                              const actualRowSpan = currentGroupItems.length;
                              return (
                                <td
                                  key={"" + index + "." + indexAttr}
                                  className="p-3 text-center text-slate-700 font-medium drop-shadow-sm"
                                  rowSpan={actualRowSpan}
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
                                  className="p-3 text-slate-700 font-medium drop-shadow-sm"
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
                                  className="p-3 text-slate-700 font-medium drop-shadow-sm"
                                >
                                  {item[attr.name]}
                                </td>
                              );
                            }
                          })}
                          <td className="p-3">
                            <input
                              type="text"
                              value={formatNumber(item?.price)}
                              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                              onChange={(e) =>
                                handleNumberChange(e, index, "price")
                              }
                              placeholder="Nhập giá"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={formatNumber(item?.stock)}
                              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
                              onChange={(e) =>
                                handleNumberChange(e, index, "stock")
                              }
                              placeholder="Nhập số lượng"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={item?.sku}
                              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400"
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