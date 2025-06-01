// menuUtils.js - Tách các hàm utility ra ngoài

// 1. Hàm xử lý drag and drop
export const moveItem = (items, draggedId, targetId, position) => {
  const deepCopy = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => deepCopy(item));
    if (typeof obj === "object") {
      const copy = {};
      Object.keys(obj).forEach((key) => {
        copy[key] = deepCopy(obj[key]);
      });
      return copy;
    }
  };

  const newItems = deepCopy(items);

  const findAndExtractItem = (items, id) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === id) {
        return items.splice(i, 1)[0];
      }
      if (items[i].children?.length) {
        const found = findAndExtractItem(items[i].children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const draggedItem = findAndExtractItem(newItems, draggedId);
  if (!draggedItem) return items;

  const insertItemAtPosition = (items, targetId, position, itemToInsert) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === targetId) {
        if (position === "before") {
          items.splice(i, 0, itemToInsert);
          return true;
        } else if (position === "after") {
          items.splice(i + 1, 0, itemToInsert);
          return true;
        } else if (position === "inside") {
          if (!items[i].children) {
            items[i].children = [];
          }
          items[i].children.push(itemToInsert);
          return true;
        }
      }

      if (items[i].children?.length) {
        if (
          insertItemAtPosition(
            items[i].children,
            targetId,
            position,
            itemToInsert
          )
        ) {
          return true;
        }
      }
    }
    return false;
  };

  insertItemAtPosition(newItems, targetId, position, draggedItem);
  return newItems;
};

// 2. Hàm kiểm tra quan hệ cha con
export const isDescendant = (parentId, childId, items) => {
  const findItem = (items, id) => {
    for (let item of items) {
      if (item._id === id) return item;
      if (item.children?.length) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const checkDescendant = (item, targetId) => {
    if (!item || !item.children) return false;
    for (let child of item.children) {
      if (child._id === targetId) return true;
      if (checkDescendant(child, targetId)) return true;
    }
    return false;
  };

  const parentItem = findItem(items, parentId);
  return checkDescendant(parentItem, childId);
};

// 3. Hàm tìm item theo ID
export const findItemById = (items, id) => {
  for (let item of items) {
    if (item._id === id) return item;
    if (item.children?.length) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

// 4. Hàm xóa item theo ID
export const removeItemById = (items, id) => {
  return items.filter((item) => {
    if (item._id === id) return false;
    if (item.children?.length) {
      item.children = removeItemById(item.children, id);
    }
    return true;
  });
};

// 5. Hàm validate form data
export const validateFormData = (formData, schema, notify) => {
  for (const field of schema) {
    if (field.required) {
      const value = formData[field.key];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        notify.changeNotify("error", `${field.label} là trường bắt buộc`);
        return false;
      }
    }
  }
  return true;
};

// 6. Hàm generate ID
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// 7. Hàm khởi tạo form data
export const initializeFormData = (schema) => {
  const data = { };
  schema.forEach((field) => {
    data[field.key] = field.defaultValue || "";
  });
  return data;
};

// 8. Hàm kiểm tra có thể drop không
export const canDropItem = (
  draggedId,
  targetId,
  position,
  menuItems,
  isDescendant
) => {
  if (draggedId === targetId) return false;
  if (isDescendant(draggedId, targetId, menuItems)) return false;
  return true;
};
