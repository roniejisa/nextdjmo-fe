import React from "react";
import * as lucideReact from "lucide-react";

import {
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Link,
} from "lucide-react";

const MenuItem = ({
  item,
  level = 0,
  menuSchema,
  expandedItems,
  draggedItem,
  dragOverItem,
  dragPosition,
  canDropItemWrapper,
  onToggleExpanded,
  onStartEdit,
  onAddChild,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item._id);
  const isDragOver = dragOverItem?._id === item._id;
  const isBeingDragged = draggedItem?._id === item._id;
  const canDrop = draggedItem
    ? canDropItemWrapper(draggedItem._id, item._id, dragPosition)
    : true;

  let dragOverClass = "";
  let dropZoneIndicator = null;

  if (isDragOver && !isBeingDragged && canDrop) {
    if (dragPosition === "before") {
      dragOverClass = "relative";
      dropZoneIndicator = (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10">
          <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      );
    } else if (dragPosition === "after") {
      dragOverClass = "relative";
      dropZoneIndicator = (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10">
          <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      );
    } else if (dragPosition === "inside") {
      dragOverClass =
        "bg-blue-50 border-2 border-blue-400 border-dashed transform scale-[1.02]";
      dropZoneIndicator = (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Thả vào đây để tạo menu con
          </div>
        </div>
      );
    }
  } else if (isDragOver && !isBeingDragged && !canDrop) {
    dragOverClass = "bg-red-50 border-2 border-red-300 border-dashed";
    dropZoneIndicator = (
      <div className="absolute inset-0 bg-red-100 bg-opacity-50 rounded-lg flex items-center justify-center pointer-events-none">
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Không thể thả vào đây
        </div>
      </div>
    );
  }

  const titleField =
    menuSchema.find((f) => f.key === "title") ||
    menuSchema.find((f) => f.required) ||
    menuSchema[0];
  const displayTitle = titleField
    ? item[titleField.key] || "Untitled"
    : "Untitled";

  const urlField = menuSchema.find((f) => f.key === "url" || f.type === "url");
  const displayUrl = urlField ? item[urlField.key] || "" : "";

  return (
    <div className="relative">
      {dropZoneIndicator}
      <div
        data-item-id={item._id}
        className={`group flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 cursor-move select-none ${dragOverClass} ${
          isBeingDragged ? "opacity-50 scale-95 rotate-2 shadow-lg z-20" : ""
        }`}
        style={{ marginLeft: `${level * 24}px` }}
        draggable={true}
        onDragStart={(e) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, item)}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <GripVertical
            className={`w-4 h-4 cursor-grab transition-colors ${
              isBeingDragged
                ? "text-blue-500"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          />

          {hasChildren && (
            <button
              onClick={() => onToggleExpanded(item._id)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          {!hasChildren && <div className="w-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {displayTitle}
            </h3>
          </div>

          {displayUrl && (
            <p className="text-sm text-gray-500 truncate flex items-center gap-1">
              <Link className="w-3 h-3" />
              {displayUrl}
            </p>
          )}

          {/* Additional fields from schema */}
          <div className="flex flex-wrap gap-2 mt-2">
            {menuSchema.slice(2).map((field) => {
              const value = item[field.key];
              if (!value) return null;
              const IconComponent = lucideReact?.[field.icon] ?? lucideReact.Type;
              return (
                <div
                  key={field.key}
                  className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                >
                  <IconComponent className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">
                    {field.type === "repeat" ? (
                      <></>
                    ) : (
                      <>
                        {field.type === "checkbox"
                          ? value
                            ? "Yes"
                            : "No"
                          : value}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddChild(item._id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Thêm menu con"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStartEdit(item, level)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {item.children.map((child) => (
            <MenuItem
              key={child._id}
              item={child}
              level={level + 1}
              menuSchema={menuSchema}
              expandedItems={expandedItems}
              draggedItem={draggedItem}
              dragOverItem={dragOverItem}
              dragPosition={dragPosition}
              canDropItemWrapper={canDropItemWrapper}
              onToggleExpanded={onToggleExpanded}
              onStartEdit={onStartEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
