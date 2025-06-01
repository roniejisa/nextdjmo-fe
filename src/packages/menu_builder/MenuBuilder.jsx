"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { defaultMenuSchema } from "./constants";
import { useNotify } from "@/context/NotifyProvider";
import {
  moveItem,
  isDescendant,
  removeItemById,
  validateFormData,
  generateId,
  initializeFormData,
  canDropItem,
} from "./menuUtils";
import MenuHeader from "./components/MenuHeader";
import SchemaConfiguration from "./components/SchemaConfiguration";
import MenuManagement from "./components/MenuManagement";
import MenuForm from "./components/MenuForm";
import MenuTypeManager from "./components/MenuTypeManager";
import { getMenu, updateMenu } from "./action";

const MenuBuilder = ({ data, moduleMain, items }) => {
  const notify = useNotify();
  const [menuSchema, setMenuSchema] = useState([]);

  // Multiple menu management
  const [menuTypes, setMenuTypes] = useState([]);
  const [currentMenuType, setCurrentMenuType] = useState("");
  const [allMenus, setAllMenus] = useState({
    header: [],
    footer: [],
    sidebar: [],
  });
  // Current menu items (based on selected menu type)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const menuItems = allMenus[currentMenuType] || [];
  const setMenuItems = (items) => {
    if (typeof items === "function") {
      setAllMenus((prev) => ({
        ...prev,
        [currentMenuType]: items(prev[currentMenuType] || []),
      }));
    } else {
      setAllMenus((prev) => ({
        ...prev,
        [currentMenuType]: items,
      }));
    }
  };

  const [parentId, setParentId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set(["2"]));
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dragCounter = useRef(0);
  const dragTimeout = useRef(null);

  const [formData, setFormData] = useState(initializeFormData(menuSchema));

  // Thay thế useEffect đầu tiên trong component MenuBuilder
  const reloadData = (data = []) => {
    data = data ? data : items;
    if (items && items.length > 0) {
      // Xử lý menuTypes từ items
      const processedMenuTypes = items.map((item) => {
        let schema;
        try {
          // Nếu có schema thì parse, không thì dùng default
          schema =
            (Array.isArray(item.schema)
              ? item.schema
              : JSON.parse(item.schema)) ?? defaultMenuSchema;
        } catch (error) {
          schema = defaultMenuSchema;
        }

        return {
          _id: item._id,
          key: item.key,
          name: item.name || item.key, // fallback to key if name is empty
          type: item.type || "simple",
          description: item.description || "Menu",
          schema: schema, // giữ nguyên schema (có thể null)
        };
      });

      setMenuTypes(processedMenuTypes);

      // Xử lý allMenus từ data của từng item
      const processedAllMenus = {};
      items.forEach((item) => {
        try {
          // Parse data JSON string thành array
          const menuData = item.data ? JSON.parse(item.data) : [];
          processedAllMenus[item.key] = menuData;
        } catch (error) {
          console.error(`Error parsing data for menu ${item.key}:`, error);
          processedAllMenus[item.key] = [];
        }
      });
      setAllMenus(processedAllMenus);

      // Set currentMenuType mặc định là menu đầu tiên
      if (processedMenuTypes.length > 0 && !currentMenuType) {
        setCurrentMenuType(processedMenuTypes[0].key);
      }
    }
  };
  useEffect(() => {
    reloadData();
  }, [items]); // Chỉ depend vào items

  // UseEffect thứ 2 cũng cần sửa một chút để xử lý schema
  useEffect(() => {
    if (currentMenuType && menuTypes.length > 0) {
      const menuType = menuTypes.find(({ key }) => key === currentMenuType);
      if (menuType) {
        let schema;

        try {
          // Nếu có schema thì parse, không thì dùng default
          schema =
            (Array.isArray(menuType.schema)
              ? menuType.schema
              : JSON.parse(menuType.schema)) ?? defaultMenuSchema;
        } catch (error) {
          schema = defaultMenuSchema;
        }
        setMenuSchema(schema);
        // Cập nhật formData với schema mới
        setFormData(initializeFormData(schema));
      }
    }
  }, [currentMenuType, menuTypes]);

  // Database operations
  const saveToDatabase = async () => {
    setIsLoading(true);
    try {
      const promises = menuTypes.map(async (menuType) => {
        const menuData = allMenus[menuType.key] || [];
        const dataToSave = {
          schema: JSON.stringify(menuSchema),
          key: menuType.key,
          name: menuType.name,
          type: menuType.type || "simple",
          data: JSON.stringify(menuData), // Chuyển về string như server expect
          description: menuType.description,
        };
        return await updateMenu(dataToSave, menuType._id);
      });
      try {
        const check = await Promise.all(promises);
        notify.changeNotify("success", "Đã lưu thành công vào database!");
      } catch (e) {
        return notify.changeNotify("error", "Chưa lưu dữ liệu thành công");
      }
    } catch (error) {
      console.error("Error saving to database:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromDatabase = async () => {
    setIsLoading(true);

    const { data, status, message } = await getMenu();
    if (status == 200) {
      reloadData(data?.items);
      notify.changeNotify("success", message);
    } else {
      notify.changeNotify("error", message);
    }
    setIsLoading(false);
  };

  const canDropItemWrapper = useCallback(
    (draggedId, targetId, position) => {
      return canDropItem(
        draggedId,
        targetId,
        position,
        menuItems,
        isDescendant
      );
    },
    [menuItems]
  );

  const exportData = () => {
    const exportData = {
      schema: menuSchema,
      menuTypes: menuTypes,
      allMenus: allMenus,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "menu-data.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.schema && data.menuTypes && data.allMenus) {
            setMenuSchema(data.schema);
            setMenuTypes(data.menuTypes);
            setAllMenus(data.allMenus);
            setFormData(initializeFormData(menuSchema));
            alert("Đã import dữ liệu thành công!");
          } else {
            alert("File không đúng định dạng!");
          }
        } catch (error) {
          alert("Có lỗi xảy ra khi đọc file!");
        }
      };
      reader.readAsText(file);
    }
  };

  // Schema management functions
  const addFieldToSchema = (fieldConfig) => {
    setMenuSchema([...menuSchema, fieldConfig]);
    setFormData((prev) => ({
      ...prev,
      [fieldConfig.key]: fieldConfig.defaultValue || "",
    }));
  };

  const validateForm = () => {
    return validateFormData(formData, menuSchema, notify);
  };

  const addMenuItem = (parentId = null) => {
    const error = validateForm();
    if (!error) return;
    const newItem = {
      _id: generateId(),
      ...formData,
      children: [],
    };

    if (parentId) {
      const updateItems = (items) => {
        return items.map((item) => {
          if (item._id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem],
            };
          }
          if (item.children?.length) {
            return {
              ...item,
              children: updateItems(item.children),
            };
          }
          return item;
        });
      };
      setMenuItems(updateItems(menuItems));
      setExpandedItems((prev) => new Set([...prev, parentId]));
    } else {
      setMenuItems((prev) => [...prev, newItem]);
    }

    setFormData(initializeFormData(menuSchema));
    setShowForm(false);
    setParentId(null);
  };

  const updateMenuItem = () => {
    const error = validateForm();
    if (!error) return;
    const updateItems = (items) => {
      return items.map((item) => {
        if (item._id === editingItem._id) {
          return {
            ...item,
            ...formData,
          };
        }
        if (item.children?.length) {
          return {
            ...item,
            children: updateItems(item.children),
          };
        }
        return item;
      });
    };

    setMenuItems(updateItems(menuItems));
    setEditingItem(null);
    setShowForm(false);
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prev) => removeItemById(prev, id));
  };

  const startEdit = (item, level) => {
    setEditingItem(item);
    const editFormData = {};
    menuSchema.forEach((field) => {
      editFormData[field.key] = item[field.key] || field.defaultValue || "";
    });
    setFormData(editFormData);
    setShowForm(true);
    setParentId(level);
  };

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Drag and drop functions
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setDragOverItem(null);
    setDragPosition(null);
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let newPosition;
    if (y < height * 0.3) {
      newPosition = "before";
    } else if (y > height * 0.7) {
      newPosition = "after";
    } else {
      newPosition = "inside";
    }

    const currentItemId = e.currentTarget.getAttribute("data-item-id");
    const canDrop = canDropItemWrapper(
      draggedItem._id,
      currentItemId,
      newPosition
    );

    if (canDrop) {
      e.dataTransfer.dropEffect = "move";
      if (dragOverItem?._id !== currentItemId || dragPosition !== newPosition) {
        setDragOverItem({ _id: currentItemId });
        setDragPosition(newPosition);
      }
    } else {
      e.dataTransfer.dropEffect = "none";
      setDragOverItem(null);
      setDragPosition(null);
    }
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }

    if (!draggedItem || !targetItem || draggedItem._id === targetItem._id) {
      handleDragEnd();
      return;
    }

    if (!canDropItemWrapper(draggedItem._id, targetItem._id, dragPosition)) {
      handleDragEnd();
      return;
    }

    setMenuItems((prev) =>
      moveItem(prev, draggedItem._id, targetItem._id, dragPosition)
    );

    if (dragPosition === "inside") {
      setExpandedItems((prev) => new Set([...prev, targetItem._id]));
    }

    handleDragEnd();
  };

  const updateSchemaField = (index, updates) => {
    const newSchema = [...menuSchema];
    newSchema[index] = { ...newSchema[index], ...updates };
    setMenuSchema(newSchema);
  };

  const removeFieldFromSchema = (key) => {
    if (menuSchema.length <= 1) {
      alert("Phải có ít nhất một trường trong schema!");
      return;
    }

    setMenuSchema(menuSchema.filter((field) => field.key !== key));

    const cleanItems = (items) => {
      return items.map((item) => {
        const { [key]: removed, ...cleanItem } = item;
        if (cleanItem.children?.length) {
          cleanItem.children = cleanItems(cleanItem.children);
        }
        return cleanItem;
      });
    };

    // Clean all menus
    const cleanedMenus = {};
    Object.keys(allMenus).forEach((menuType) => {
      cleanedMenus[menuType] = cleanItems(allMenus[menuType]);
    });
    setAllMenus(cleanedMenus);

    const { [key]: removed, ...newFormData } = formData;
    setFormData(newFormData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-6">
        {/* Header */}
        <MenuHeader
          menuItems={menuItems}
          menuSchema={menuSchema}
          isLoading={isLoading}
          onSaveToDatabase={saveToDatabase}
          onLoadFromDatabase={loadFromDatabase}
          onExportData={exportData}
          onImportData={importData}
          currentMenuType={currentMenuType}
          menuTypes={menuTypes}
        />

        {/* Menu Type Management */}
        <MenuTypeManager
          menuTypes={menuTypes}
          currentMenuType={currentMenuType}
          allMenus={allMenus}
          onMenuTypesChange={setMenuTypes}
          onAllMenusChange={setAllMenus}
          onCurrentMenuTypeChange={setCurrentMenuType}
        />
        {menuTypes && currentMenuType && (
          <>
            <div className="grid grid-cols-12 gap-6">
              {/* Schema Configuration */}
              <div className="col-span-4">
                <SchemaConfiguration
                  menuSchema={menuSchema}
                  onUpdateSchema={updateSchemaField}
                  onRemoveField={removeFieldFromSchema}
                  onAddField={addFieldToSchema}
                  canRemoveField={menuSchema.length > 1}
                />
              </div>

              {/* Menu Management */}
              <div className="col-span-8">
                <MenuManagement
                  menuItems={menuItems}
                  menuSchema={menuSchema}
                  expandedItems={expandedItems}
                  draggedItem={draggedItem}
                  dragOverItem={dragOverItem}
                  dragPosition={dragPosition}
                  canDropItemWrapper={canDropItemWrapper}
                  onToggleExpanded={toggleExpanded}
                  onStartEdit={startEdit}
                  onAddChild={(itemId) => {
                    setEditingItem(null);
                    setFormData(initializeFormData(menuSchema));
                    setShowForm(true);
                    setParentId(itemId);
                  }}
                  onDelete={deleteMenuItem}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onAddNewItem={() => {
                    setEditingItem(null);
                    setFormData(initializeFormData(menuSchema));
                    setShowForm(true);
                    setParentId(null);
                  }}
                  currentMenuType={currentMenuType}
                  menuTypes={menuTypes}
                />
              </div>
            </div>

            <MenuForm
              isOpen={showForm}
              formData={formData}
              menuSchema={menuSchema}
              editingItem={editingItem}
              parentId={parentId}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData(initializeFormData(menuSchema));
                setParentId(null);
              }}
              onSubmit={
                editingItem ? updateMenuItem : () => addMenuItem(parentId)
              }
              onFormDataChange={setFormData}
            />
          </>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-900">Đang xử lý...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBuilder;
