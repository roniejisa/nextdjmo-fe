"use client";
import React, { useContext, useState } from "react";
import { Plus, Edit3, Copy, Trash2 } from "lucide-react";
import { generateId } from "../menuUtils";
import { useNotify } from "@/context/NotifyProvider";
import { copyMenu, deleteMenu, saveMenu, updateMenu } from "../action";
import { CMSContext } from "@/context/cms/CMSProvider";
import { formatKey } from "@/utils/client";
import { useConfirmModal } from "@/hooks/useConfirmModal";
const MenuTypeManager = ({
  menuTypes,
  currentMenuType,
  allMenus,
  onMenuTypesChange,
  onAllMenusChange,
  onCurrentMenuTypeChange,
}) => {
  const [setConfirmModal] = useConfirmModal();
  const notify = useNotify();
  const [showMenuTypeForm, setShowMenuTypeForm] = useState(false);
  const [editingMenuType, setEditingMenuType] = useState(null);
  const [menuTypeFormData, setMenuTypeFormData] = useState({
    key: "",
    name: "Menu",
    description: "Menu",
  });

  // Helper function to validate key uniqueness
  const isKeyUnique = (key, excludeId = null) => {
    return !menuTypes.some(
      (type) => type.key === key && type._id !== excludeId
    );
  };

  // Helper function to generate key from name
  const resetForm = () => {
    setMenuTypeFormData({ key: "", name: "", description: "" });
    setEditingMenuType(null);
    setShowMenuTypeForm(false);
  };

  const addMenuType = async () => {
    if (!menuTypeFormData.name.trim()) {
      notify.changeNotify("error", "Vui lòng nhập tên menu!");
      return;
    }

    if (!menuTypeFormData.key.trim()) {
      notify.changeNotify("error", "Vui lòng nhập key cho menu!");
      return;
    }

    if (!isKeyUnique(menuTypeFormData.key.trim())) {
      notify.changeNotify(
        "error",
        "Key này đã tồn tại! Vui lòng sử dụng key khác."
      );
      return;
    }

    // const newId = generateId();
    const newKey = menuTypeFormData.key.trim();
    const newMenuType = {
      key: newKey,
      name: menuTypeFormData.name.trim(),
      description: menuTypeFormData.description.trim(),
    };
    const { data, status, message } = (await saveMenu(newMenuType)) ?? {};
    if (status == 201) {
      notify.changeNotify("success", message);
      newMenuType._id = data._id;
      // Chỗ này cần callback lên server để kiểm tra xem có key đó hay chưa
      onMenuTypesChange([...menuTypes, newMenuType]);
      onAllMenusChange({
        ...allMenus,
        [newKey]: [],
      });

      resetForm();
    } else {
      notify.changeNotify("error", message);
    }
  };

  const updateMenuType = async () => {
    if (!menuTypeFormData.name.trim()) {
      notify.changeNotify("error", "Vui lòng nhập tên menu!");
      return;
    }

    if (!menuTypeFormData.key.trim()) {
      notify.changeNotify("error", "Vui lòng nhập key cho menu!");
      return;
    }

    if (!isKeyUnique(menuTypeFormData.key, editingMenuType._id)) {
      notify.changeNotify(
        "error",
        "Key này đã tồn tại! Vui lòng sử dụng key khác."
      );
      return;
    }

    const oldKey = editingMenuType.key;
    const newKey = menuTypeFormData.key.trim();
    const { status, data, message } = await updateMenu(
      menuTypeFormData,
      menuTypeFormData._id
    );
    if (status == 200) {
      // Update menu types
      const updatedMenuTypes = menuTypes.map((type) =>
        type._id === editingMenuType._id
          ? {
              ...type,
              key: newKey,
              name: menuTypeFormData.name.trim(),
              description: menuTypeFormData.description.trim(),
            }
          : type
      );
      onMenuTypesChange(updatedMenuTypes);

      // Update allMenus keys if key changed
      if (oldKey !== newKey) {
        const { [oldKey]: menuItems, ...rest } = allMenus;
        onAllMenusChange({
          ...rest,
          [newKey]: menuItems || [],
        });

        // Update current menu type if it was being edited
        if (currentMenuType === oldKey) {
          onCurrentMenuTypeChange(newKey);
        }
      }

      resetForm();
      notify.changeNotify("success", message);
    } else {
      notify.changeNotify("error", message);
    }
  };

  const deleteMenuType = (typeId) => {
    const typeToDelete = menuTypes.find((type) => type._id === typeId);

    setConfirmModal({
      title: (
        <span>
          Bạn có chắc chắn muốn xóa Menu{" "}
          <span className="text-red-600">{typeToDelete.name}</span> này không ?
        </span>
      ),
      onConfirm: async () => {
        const { status, data, message } = await deleteMenu(typeToDelete._id);
        if (status == 200) {
          notify.changeNotify("success", message);
          const updatedMenuTypes = menuTypes.filter(
            (type) => type._id !== typeToDelete._id
          );
          onMenuTypesChange(updatedMenuTypes);

          const { [typeToDelete.key]: removed, ...rest } = allMenus;
          onAllMenusChange(rest);
          if (currentMenuType === typeToDelete.key) {
            const remainingType = updatedMenuTypes[0];
            onCurrentMenuTypeChange(remainingType?.key);
          }
          return message;
        } else {
          throw new Error(message);
        }
      },
    });
  };

  const duplicateItems = (items) => {
    return items.map((item) => ({
      ...item,
      _id: generateId(),
      children: item.children ? duplicateItems(item.children) : [],
    }));
  };

  const duplicateMenuType = async (sourceTypeId) => {
    const typeToCopy = menuTypes.find((type) => type._id === sourceTypeId);
    setConfirmModal({
      title: (
        <span>
          Bạn có chắc chắn muốn copy Menu{" "}
          <span className="text-outline">{typeToCopy.name}</span> này không ?
        </span>
      ),
      onConfirm: async () => {
        const {
          status,
          message,
          data: newMenuType,
        } = await copyMenu(sourceTypeId);
        if (status == 200) {
          let sourceItems;
          try {
            sourceItems = JSON.parse(newMenuType?.data);
          } catch (e) {
            sourceItems = [];
          }

          let parsedSchema;
          try {
            parsedSchema = newMenuType.schema
              ? JSON.parse(newMenuType.schema)
              : defaultMenuSchema;
          } catch (error) {
            console.error("Error parsing schema for duplicated menu:", error);
            parsedSchema = defaultMenuSchema;
          }

          // Tạo object menuType với schema đã parse (giống như trong useEffect đầu tiên)
          const processedNewMenuType = {
            _id: newMenuType._id,
            key: newMenuType.key,
            name: newMenuType.name || newMenuType.key,
            type: newMenuType.type || "simple",
            description: newMenuType.description || "Menu",
            schema: parsedSchema, // Schema đã được parse thành object
          };

          // Cập nhật menuTypes với schema đã parse
          const updatedMenuTypes = [...menuTypes, processedNewMenuType];
          onMenuTypesChange(updatedMenuTypes);

          const updatedAllMenus = {
            ...allMenus,
            [newMenuType.key]: duplicateItems(sourceItems),
          };
          onAllMenusChange(updatedAllMenus);

          onCurrentMenuTypeChange(newMenuType.key);
          return message;
        } else {
          throw new Error(message);
        }
      },
    });
  };

  const startEditMenuType = (menuType) => {
    setEditingMenuType(menuType);
    setMenuTypeFormData({
      _id: menuType._id,
      key: menuType.key,
      name: menuType.name,
      description: menuType.description,
    });
    setShowMenuTypeForm(true);
  };

  const startAddMenuType = () => {
    resetForm();
    setShowMenuTypeForm(true);
  };

  return (
    <>
      {/* Menu Type Management Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Quản lý loại Menu
            </h2>
            <button
              onClick={startAddMenuType}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm loại Menu
            </button>
          </div>
        </div>

        <div className="p-4">
          {menuTypes.length === 0 ? (
            <div className="flex justify-center">
              <button
                onClick={startAddMenuType}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm loại Menu đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {menuTypes.map((menuType) => (
                <div
                  key={menuType._id}
                  className={`border relative rounded-lg p-4 cursor-pointer transition-all ${
                    currentMenuType === menuType.key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onCurrentMenuTypeChange(menuType.key)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium inline-block text-gray-900">
                        {menuType.name}{" "}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {menuType.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">
                          {(allMenus[menuType.key] || []).length} items
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {menuType.key}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditMenuType(menuType);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateMenuType(menuType._id);
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Sao chép"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {menuTypes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMenuType(menuType._id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Type Form Modal */}
      {showMenuTypeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingMenuType ? "Sửa loại Menu" : "Thêm loại Menu mới"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key (dùng cho SQL query) *
                  </label>
                  <input
                    type="text"
                    value={menuTypeFormData.key}
                    onChange={(e) => {
                      // Chỉ cập nhật giá trị, không format ngay
                      setMenuTypeFormData((prev) => ({
                        ...prev,
                        key: e.target.value,
                      }));
                    }}
                    onBlur={(e) => {
                      // Format khi người dùng rời khỏi input
                      const formattedKey = formatKey(e.target.value);
                      setMenuTypeFormData((prev) => ({
                        ...prev,
                        key: formattedKey,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="header, footer, sidebar..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ được dùng chữ thường, số và dấu gạch dưới
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Menu *
                  </label>
                  <input
                    type="text"
                    value={menuTypeFormData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setMenuTypeFormData((prev) => ({
                        ...prev,
                        name,
                        // Chỉ auto-generate key khi không đang edit và key rỗng hoặc được auto-generate
                        key:
                          !editingMenuType && // Thêm điều kiện này
                          (prev.key === "" || prev.key === formatKey(prev.name))
                            ? formatKey(name)
                            : prev.key,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Header Menu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={menuTypeFormData.description}
                    onChange={(e) =>
                      setMenuTypeFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Mô tả về menu này..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={editingMenuType ? updateMenuType : addMenuType}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMenuType ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuTypeManager;
