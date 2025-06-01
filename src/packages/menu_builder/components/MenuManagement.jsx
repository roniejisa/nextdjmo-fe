import React from "react";
import {
  Layout,
  Plus,
  Navigation,
} from "lucide-react";
import MenuItem from "./MenuItem";

const MenuManagement = ({
  menuItems = [],
  menuSchema = [],
  expandedItems = new Set(),
  draggedItem = null,
  dragOverItem = null,
  dragPosition = null,
  canDropItemWrapper,
  onToggleExpanded,
  onStartEdit,
  onAddChild,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onAddNewItem,
}) => {
  const renderMenuItem = (item, level = 0) => {
    return (
      <MenuItem
        key={item._id}
        item={item}
        level={level}
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
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Layout className="w-5 h-5 text-gray-600" />
              Menu Items
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Kéo thả để sắp xếp, nhấp để mở rộng menu con
            </p>
          </div>

          <button
            onClick={onAddNewItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm menu
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {menuItems.length === 0 ? (
          <EmptyState onAddFirst={onAddNewItem} />
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onAddFirst }) => {
  return (
    <div className="text-center py-12">
      <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Chưa có menu nào
      </h3>
      <p className="text-gray-600 mb-4">
        Bắt đầu bằng cách thêm menu item đầu tiên
      </p>
      <button
        onClick={onAddFirst}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Thêm menu đầu tiên
      </button>
    </div>
  );
};

export default MenuManagement;