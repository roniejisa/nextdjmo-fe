"use client";

import { useEffect, useState } from "react";

const AttributeListRender = ({
  listAttribute,
  dragEnd,
  deleteAttribute,
  changeNameAttribute,
  handleDrop,
  dragOver,
  handleChangeValue,
  dragStart,
  deleteAttributeValue,
}) => {
  // State để quản lý trạng thái thu gọn của từng attribute
  const [collapsedAttributes, setCollapsedAttributes] = useState(new Set());

  // Toggle thu gọn một attribute cụ thể
  const toggleAttributeCollapse = (index) => {
    const newCollapsed = new Set(collapsedAttributes);
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedAttributes(newCollapsed);
  };

  // Toggle thu gọn tất cả attributes
  const toggleAllAttributes = () => {
    if (collapsedAttributes.size === listAttribute.length) {
      setCollapsedAttributes(new Set());
    } else {
      setCollapsedAttributes(new Set(listAttribute.map((_, index) => index)));
    }
  };

  useEffect(() => {
    toggleAllAttributes()
  },[listAttribute])

  return (
    <div className="flex flex-wrap flex-col gap-4 p-6 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none mt-4">
      {/* Header controls */}
      {listAttribute.length > 1 && (
        <div className="flex gap-2 my-2 items-center px-4">
          <h3 className="font-semibold text-slate-700 text-lg drop-shadow-sm">
            Thuộc tính
          </h3>
          <button
            type="button"
            onClick={toggleAllAttributes}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-slate-100/80 to-slate-200/60 hover:from-slate-200/80 hover:to-slate-300/60 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200 text-slate-700"
          >
            {collapsedAttributes.size === listAttribute.length
              ? "Mở rộng tất cả"
              : "Thu gọn tất cả"}
          </button>
        </div>
      )}

      {listAttribute.map((item, index) => {
        const isCollapsed = collapsedAttributes.has(index);

        return (
          <div
            className={`p-6 pr-16 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none ${
              isCollapsed ? "pb-0" : ""
            }`}
            key={index}
            onDragEnd={dragEnd}
            onDragLeave={(e) => {
              // Remove visual feedback khi drag leave
              e.currentTarget
                .querySelectorAll(".item-group")
                .forEach((item) => {
                  item.classList.remove("drag-over");
                });
            }}
          >
            {/* Delete button */}
            <button
              type="button"
              onClick={(e) => deleteAttribute(index)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-br from-red-500/90 to-red-600/80 hover:from-red-600/90 hover:to-red-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-95 transition-all duration-200 text-white"
            >
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
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            {/* Attribute name section with collapse button */}
            <div className="relative">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleAttributeCollapse(index)}
                  className="p-1.5 rounded-lg bg-gradient-to-br from-slate-100/80 to-slate-200/60 hover:from-slate-200/80 hover:to-slate-300/60 border border-white/30 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] transition-all duration-200 text-slate-600"
                  title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                >
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
                    className={`transition-transform duration-200 ${
                      isCollapsed ? "rotate-180" : ""
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm">
                  Thuộc tính: {item.name}
                </label>
                {isCollapsed && (
                  <span className="text-sm font-semibold text-slate-700 drop-shadow-sm border p-2 rounded-md">
                    {item.values?.length || 0} giá trị
                  </span>
                )}
              </div>
              <input
                type="text"
                className={`w-full px-4 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400 font-medium ${
                  isCollapsed
                    ? "max-h-0 pt-0 border-t-0"
                    : "py-3 max-h-none mt-4"
                }`}
                value={item.name}
                onChange={(e) => changeNameAttribute(e, index)}
                placeholder="Nhập tên thuộc tính"
              />
            </div>

            {/* Values section - có thể thu gọn */}
            <div
              className={`border-t border-white/20 pt-4 relative transition-all duration-300 ${
                isCollapsed ? "max-h-0 pt-0 border-t-0" : "max-h-none"
              }`}
            >
              <h4
                className={`text-sm font-semibold text-slate-700 drop-shadow-sm mb-3 ${
                  isCollapsed ? "max-h-0" : "max-h-none"
                }`}
              >
                Giá trị thuộc tính ({item.values?.length || 0} giá trị)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {item.values?.map((value, indexValue) => (
                  <div
                    className="item-group"
                    key={indexValue}
                    onDragOver={(e) => dragOver(e, index, indexValue)}
                    onDrop={(e) => handleDrop(e, index, indexValue)}
                  >
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.7)] transition-all duration-200">
                      <input
                        type="text"
                        value={value.value}
                        className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.6)] focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.12),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-0 focus:border-blue-400/40 transition-all duration-200 text-slate-700 placeholder-slate-400 text-sm"
                        placeholder={value.placeholder}
                        onChange={(e) =>
                          handleChangeValue(e, index, indexValue)
                        }
                      />

                      <button
                        draggable="true"
                        onDragStart={(e) => dragStart(e, index, indexValue)}
                        className="p-2 rounded-lg bg-gradient-to-br from-slate-100/80 to-slate-200/60 hover:from-slate-200/80 hover:to-slate-300/60 border border-white/30 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200 text-slate-600 cursor-grab active:cursor-grabbing"
                        tabIndex="-1"
                        type="button"
                      >
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
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M18 9l3 3l-3 3" />
                          <path d="M15 12h6" />
                          <path d="M6 9l-3 3l3 3" />
                          <path d="M3 12h6" />
                          <path d="M9 18l3 3l3 -3" />
                          <path d="M12 15v6" />
                          <path d="M15 6l-3 -3l-3 3" />
                          <path d="M12 3v6" />
                        </svg>
                      </button>

                      <button
                        onClick={() => deleteAttributeValue(index, indexValue)}
                        className="p-2 rounded-lg bg-gradient-to-br from-red-100/80 to-red-200/60 hover:from-red-200/80 hover:to-red-300/60 border border-white/30 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] transform hover:scale-95 transition-all duration-200 text-red-600"
                        type="button"
                        tabIndex="-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                          <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttributeListRender;
