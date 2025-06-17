"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ImageComponent from "./product_variant/Image";
import { makeId } from "@/utils/client";

const generateCombinations = (attributes) => {
  let combinations = [{}];

  attributes.forEach((attribute, indexAttr) => {
    const { name, values } = attribute;
    const newCombinations = [];

    if (indexAttr == 0 && values.length <= 1) {
      combinations.forEach((combo) => {
        newCombinations.push({
          id: values[0]?.id,
          ...combo,
          [name]: values[0].value,
        });
      });
    } else if (
      values.length === 0 ||
      values.every((objValue) => !objValue.value)
    ) {
      combinations.forEach((combo) => {
        newCombinations.push({
          id: indexAttr == 0 ? combo?.id : "",
          ...combo,
          [name]: "",
        });
      });
    } else {
      values
        .filter((value) => value.value)
        .forEach((value) => {
          combinations.forEach((combo) => {
            newCombinations.push({
              id: indexAttr == 0 ? value?.id : "",
              ...combo,
              [name]: value.value,
            });
          });
        });
    }
    combinations = newCombinations;
  });

  return combinations;
};

const sortData = (data) => {
  const grouped = new Map();

  data.forEach((item) => {
    const value = Object.values(item)[0];

    if (!grouped.has(value)) {
      grouped.set(value, []);
    }
    grouped.get(value).push(item);
  });

  const result = [];
  [...grouped.keys()]
    .sort((a, b) => a - b)
    .forEach((number) => {
      const group = grouped.get(number);
      group.sort((a, b) => {
        if (a.value && b.value) {
          return a.value.localeCompare(b.value);
        }
        return 0;
      });
      result.push(...group);
    });

  return result;
};

const generateKey = (item) => {
  const arrayData = Object.entries(item)
    .map((entry) => {
      if (!["price", "sku", "stock", "image"].includes(entry[0])) {
        return entry;
      }
      return null;
    })
    .filter((entry) => entry !== null);
  return arrayData.map((entry) => entry.join(":")).join("|");
};

const generateSKU = (item, listAttribute, existingSKUs = []) => {
  let baseSKU = "";

  listAttribute.forEach((attr) => {
    const value = item[attr.name];
    if (value) {
      const shortValue = value
        .replace(/\s+/g, "")
        .substring(0, 3)
        .toUpperCase();
      baseSKU += shortValue;
    }
  });

  if (!baseSKU) {
    baseSKU = "SKU" + makeId(6).toUpperCase();
  }

  let finalSKU = baseSKU;
  let counter = 1;

  while (existingSKUs.includes(finalSKU)) {
    finalSKU = baseSKU + counter.toString().padStart(2, "0");
    counter++;
  }

  return finalSKU;
};

const ProductVariant = ({ field, item, value }) => {
  const initialData = useMemo(() => (value ? JSON.parse(value) : {}), [value]);
  const [hasVariant, setHasVariant] = useState(false);
  const [attribute, setAttribute] = useState("");
  const [activeVariant, setActiveVariant] = useState(
    field.active_variant == "active"
  );
  const [listAttribute, setListAttribute] = useState(
    initialData?.listAttribute ?? []
  );
  const [data, setData] = useState(initialData?.data ?? []);

  // States cho bulk edit nâng cao
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    price: "",
    stock: "",
    sku: "",
  });

  // States cho tính năng thu gọn
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [showAdvancedBulkEdit, setShowAdvancedBulkEdit] = useState(false);
  const [attributeFilters, setAttributeFilters] = useState({});
  const [bulkEditMode, setBulkEditMode] = useState("all"); // 'all', 'filtered', 'selected'

  const oldData = useRef(null);
  const textareaRef = useRef(null);
  const dataMoveRef = useRef(null);
  const firstAttributeLength = useRef(0);
  const oldValue = useRef(null);
  const inputAddAttributeRef = useRef(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const suggestionRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(value);
  const [resetKey, setResetKey] = useState(0);

  // Force remount khi value thay đổi
  useEffect(() => {
    if (currentValue !== value) {
      setCurrentValue(value);
      setResetKey((prev) => prev + 1);

      const newInitialData = value ? JSON.parse(value) : {};
      setHasVariant(false);
      setAttribute("");
      setListAttribute(newInitialData?.listAttribute ?? []);
      setData(newInitialData?.data ?? []);
      setSelectedItems(new Set());
      setShowBulkEdit(false);
      setBulkEditData({ price: "", stock: "", sku: "" });
      setCollapsedGroups(new Set());
      setShowAdvancedBulkEdit(false);
      setAttributeFilters({});
    }
  }, [value, currentValue]);

  useEffect(() => {
    if (data.length > 0) {
      const all = {
        data,
        listAttribute,
      };
      textareaRef.current.value = JSON.stringify(all);
    } else {
      textareaRef.current.value = "";
    }
  }, [data, listAttribute]);

  useEffect(() => {
    try {
      oldData.current = JSON.parse(value);
    } catch (e) {}
    if (
      oldData.current &&
      "data" in oldData.current &&
      "listAttribute" in oldData.current &&
      oldData.current.listAttribute.length > 0
    ) {
      setHasVariant(true);
      setListAttribute(oldData.current.listAttribute);
    } else if (oldData.current && "data" in oldData.current) {
      setData([...oldData.current.data]);
    }
  }, [value]);

  // Nhóm dữ liệu theo thuộc tính đầu tiên để thu gọn
  const groupedData = useMemo(() => {
    if (!data.length || !listAttribute.length) return {};

    const firstAttrName = listAttribute[0].name;
    const groups = {};

    data.forEach((item, index) => {
      const groupKey = item[firstAttrName] || "Không xác định";
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push({ ...item, originalIndex: index });
    });

    return groups;
  }, [data, listAttribute]);

  // Lọc dữ liệu theo bộ lọc thuộc tính
  const filteredData = useMemo(() => {
    if (Object.keys(attributeFilters).length === 0) return data;

    return data.filter((item) => {
      return Object.entries(attributeFilters).every(
        ([attrName, filterValue]) => {
          if (!filterValue) return true;
          return item[attrName] === filterValue;
        }
      );
    });
  }, [data, attributeFilters]);

  // Hàm kiểm tra SKU trùng lặp
  const checkDuplicateSKU = (newSKU, currentIndex = -1) => {
    return data.some(
      (item, index) => index !== currentIndex && item.sku === newSKU
    );
  };

  // Hàm tạo SKU cho tất cả items
  const generateSKUsForAllItems = (items, listAttribute) => {
    const existingSKUs = [];

    return items.map((item) => {
      if (!item.sku || item.sku.trim() === "") {
        const newSKU = generateSKU(item, listAttribute, existingSKUs);
        existingSKUs.push(newSKU);
        return { ...item, sku: newSKU };
      }
      existingSKUs.push(item.sku);
      return item;
    });
  };

  // Toggle thu gọn nhóm
  const toggleGroupCollapse = (groupKey) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupKey)) {
      newCollapsed.delete(groupKey);
    } else {
      newCollapsed.add(groupKey);
    }
    setCollapsedGroups(newCollapsed);
  };

  // Thu gọn/mở tất cả
  const toggleAllGroups = () => {
    const allGroupKeys = Object.keys(groupedData);
    if (collapsedGroups.size === allGroupKeys.length) {
      setCollapsedGroups(new Set());
    } else {
      setCollapsedGroups(new Set(allGroupKeys));
    }
  };

  // Chọn theo nhóm
  const selectGroup = (groupKey) => {
    const groupItems = groupedData[groupKey] || [];
    const newSelected = new Set(selectedItems);

    const isAllSelected = groupItems.every((item) =>
      newSelected.has(item.originalIndex)
    );

    if (isAllSelected) {
      // Bỏ chọn nhóm
      groupItems.forEach((item) => {
        newSelected.delete(item.originalIndex);
      });
    } else {
      // Chọn nhóm
      groupItems.forEach((item) => {
        newSelected.add(item.originalIndex);
      });
    }

    setSelectedItems(newSelected);
  };

  // Chỉnh sửa hàng loạt nâng cao
  const handleAdvancedBulkEdit = () => {
    let targetItems = [];

    switch (bulkEditMode) {
      case "selected":
        targetItems = Array.from(selectedItems);
        break;
      case "filtered":
        targetItems = filteredData.map((_, index) =>
          data.findIndex((item) => item === filteredData[index])
        );
        break;
      case "all":
      default:
        targetItems = data.map((_, index) => index);
        break;
    }

    if (targetItems.length === 0) {
      alert("Không có sản phẩm nào để chỉnh sửa!");
      return;
    }

    setData((prev) => {
      const newData = [...prev];
      targetItems.forEach((index) => {
        if (bulkEditData.price && bulkEditData.price.trim() !== "") {
          newData[index].price = bulkEditData.price;
        }
        if (bulkEditData.stock && bulkEditData.stock.trim() !== "") {
          newData[index].stock = bulkEditData.stock;
        }
        if (bulkEditData.sku && bulkEditData.sku.trim() !== "") {
          const skuWithSuffix =
            targetItems.length > 1
              ? `${bulkEditData.sku}-${String(index + 1).padStart(2, "0")}`
              : bulkEditData.sku;
          newData[index].sku = skuWithSuffix;
        }
      });
      return newData;
    });

    // Reset
    setBulkEditData({ price: "", stock: "", sku: "" });
    setShowAdvancedBulkEdit(false);
    setSelectedItems(new Set());
  };

  const showProductAttributeAvailable = (e) => {
    setShowSuggestion(true);
  };

  const handleClickOutside = (event) => {
    if (
      showSuggestion &&
      suggestionRef.current &&
      !event.target.contains(suggestionRef.current)
    ) {
      setShowSuggestion(false);
    }
  };

  useEffect(() => {
    if (showSuggestion) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestion]);

  const addAttribute = () => {
    if (attribute.trim() === "" || /^\d/.test(attribute.trim()))
      return inputAddAttributeRef.current.focus();
    setListAttribute((prev) => {
      const exists = prev.some((item) => item.name === attribute);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: makeId(8),
          name: attribute,
          values: [
            {
              id: makeId(8),
              placeholder: "Giá trị",
              value: "",
            },
          ],
        },
      ];
    });
    setAttribute("");
  };

  useEffect(() => {
    if (listAttribute.length > 0) {
      const newData = generateCombinations(listAttribute);
      const listData = sortData(newData);

      setData((prev) => {
        if (prev.length === 0 && oldData.current) {
          prev = oldData.current.data;
        }
        const newListData = listData.map((item) => {
          const key = generateKey(item);
          const oldData = prev.find((prevItem) => {
            const dataKey = generateKey(prevItem);
            if (key.length > dataKey.length) {
              return key.includes(dataKey);
            } else {
              return dataKey.includes(key);
            }
          });
          const getKeyOfFirstAttribute = listAttribute[0].name;
          const getItemOldHasImage = prev.find(
            (prevItem) =>
              prevItem[getKeyOfFirstAttribute] ===
                item[getKeyOfFirstAttribute] && prevItem.image
          );
          if (!oldData)
            return {
              price: "",
              stock: 0,
              sku: "",
              image: getItemOldHasImage ? getItemOldHasImage.image : "",
              ...item,
            };
          return {
            ...item,
            price: oldData.price ?? "",
            stock: oldData.stock ?? 0,
            sku: oldData.sku ?? "",
            image: getItemOldHasImage ? getItemOldHasImage.image : "",
          };
        });

        const dataWithSKU = generateSKUsForAllItems(newListData, listAttribute);
        return dataWithSKU;
      });
    } else if (hasVariant) {
      setData([]);
    }

    firstAttributeLength.current = listAttribute.reduce((acc, item, index) => {
      if (index) {
        if (!acc) {
          acc = item.values.length - (item.values.length > 1 ? 1 : 0);
        } else {
          const length = item.values.filter((item) => item.value).length;
          const number = length > 1 ? length : 1;
          acc *= number;
        }
      }
      return acc;
    }, 0);
  }, [listAttribute, value]);

  const addValue = (index) => {
    setListAttribute((prev) => {
      const newList = [...prev];
      newList[index] = {
        ...newList[index],
        values: [
          ...(newList[index].values || []),
          {
            id: makeId(8),
            placeholder: "Giá trị",
            value: "",
          },
        ],
      };
      return newList;
    });
  };

  const changeNameAttribute = (e, index) => {
    const value = e.target.value.trim();
    if (/^\d/.test(value)) return;
    setListAttribute((prev) => {
      const newList = [...prev];
      newList[index] = {
        ...newList[index],
        name: e.target.value,
      };
      return newList;
    });
  };

  // DRAG AND DROP functions (giữ nguyên như code gốc)
  const dragEnd = (e) => {
    dataMoveRef.current = null;
    e.preventDefault();
  };

  const dragStart = (e, index, indexValue) => {
    dataMoveRef.current = listAttribute[index].values[indexValue];
    dataMoveRef.current.index = indexValue;
    dataMoveRef.current.attribute_id = index;

    const draggedItem = e.target.closest(".item-group");
    const preview = draggedItem.cloneNode(true);

    preview.style.position = "absolute";
    preview.style.top = `${e.clientY}px`;
    preview.style.left = `${e.clientX}px`;
    preview.style.zIndex = "1000";
    preview.style.pointerEvents = "none";
    preview.style.opacity = "0.5";

    document.body.appendChild(preview);

    e.dataTransfer.setDragImage(
      preview,
      e.clientX - draggedItem.getBoundingClientRect().left - 50,
      e.clientY - draggedItem.getBoundingClientRect().top
    );

    setTimeout(() => document.body.removeChild(preview), 0);
  };

  const dragOver = (e, index, indexNew) => {
    e.stopPropagation();
    e.preventDefault();
    if (!dataMoveRef.current) return;
    const indexOld = dataMoveRef.current.index;
    const attributeOld = dataMoveRef.current.attribute_id;
    const draggingElement = e.currentTarget;

    if (!draggingElement || attributeOld !== index) return;
    const rect = draggingElement.getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;

    const isNearMiddle = Math.abs(e.clientY - middleY) < rect.height / 4;

    if (isNearMiddle && indexOld !== indexNew) {
      setListAttribute((prev) => {
        const newList = [...prev];
        const listIndexCurrent = [...newList[index].values];
        const valueMove = listIndexCurrent[indexOld];
        listIndexCurrent.splice(indexOld, 1);
        listIndexCurrent.splice(indexNew, 0, valueMove);

        newList[index] = {
          ...newList[index],
          values: listIndexCurrent,
        };
        dataMoveRef.current.index = indexNew;
        return newList;
      });
    }
  };

  const handleChangeValue = (e, index, indexValue) => {
    const valuesLength = listAttribute[index].values.length;

    if (valuesLength - 1 == indexValue && e.target.value.trim() !== "") {
      addValue(index);
    }

    setListAttribute((prev) => {
      prev[index].values[indexValue].value = e.target.value;
      return [...prev];
    });
  };

  const deleteAttribute = (index) => {
    setListAttribute((prev) => {
      const newList = [...prev];
      newList.splice(index, 1);
      return [...newList];
    });
  };

  const changeData = (e, index, key) => {
    let value = e.target.value.trim();
    switch (key) {
      case "stock":
      case "price":
        if (isNaN(value) || Number(value) <= 0) {
          value = value.replace(/[^0-9.]/g, "");
        }
        value = value > 0 ? value : 0;
        break;
      case "sku":
        if (checkDuplicateSKU(value, index)) {
          alert("SKU đã tồn tại! Vui lòng nhập SKU khác.");
          return;
        }
        break;
    }
    setData((prev) => {
      const newData = [...prev];
      newData[index][key] = value;
      return newData;
    });
  };

  const upImageForData = (imageData, attrName, value) => {
    const newData = data.map((item) => {
      if (item[attrName] == value) {
        item.image = imageData;
      }
      return item;
    });
    setData(newData);
  };

  const deleteAttributeValue = (index, indexValue) => {
    if (indexValue == listAttribute[index].values.length - 1) return;
    const values = listAttribute[index].values.filter(
      (item, i) => i !== indexValue
    );
    if (values.length == 0) return deleteAttribute(index);
    setListAttribute((prev) => {
      prev[index].values = values;
      return [...prev];
    });
  };

  const changeStock = (e) => {
    setData((prev) => {
      if (!prev.length) prev.push({});
      const obj = prev[0];
      obj.stock = e.target.value;
      return [...prev];
    });
  };

  const handleChangeSku = (e) => {
    const newSKU = e.target.value;
    if (data.length > 1 && checkDuplicateSKU(newSKU, 0)) {
      alert("SKU đã tồn tại! Vui lòng nhập SKU khác.");
      return;
    }

    setData((prev) => {
      if (!prev.length) prev.push({});
      const obj = prev[0];
      obj.sku = newSKU;
      return [...prev];
    });
  };

  const handleChangePrice = (e) => {
    setData((prev) => {
      if (!prev.length) prev.push({});
      const obj = prev[0];
      obj.price = e.target.value;
      return [...prev];
    });
  };

  const handleSelectItem = (index) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === data.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.map((_, index) => index)));
    }
  };

  const handleBulkEdit = () => {
    if (selectedItems.size === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để chỉnh sửa!");
      return;
    }
    setShowBulkEdit(true);
  };

  const applyBulkEdit = () => {
    setData((prev) => {
      const newData = [...prev];
      selectedItems.forEach((index) => {
        if (bulkEditData.price && bulkEditData.price.trim() !== "") {
          newData[index].price = bulkEditData.price;
        }
        if (bulkEditData.stock && bulkEditData.stock.trim() !== "") {
          newData[index].stock = bulkEditData.stock;
        }
        if (bulkEditData.sku && bulkEditData.sku.trim() !== "") {
          const skuWithSuffix =
            selectedItems.size > 1
              ? `${bulkEditData.sku}-${String(index + 1).padStart(2, "0")}`
              : bulkEditData.sku;
          newData[index].sku = skuWithSuffix;
        }
      });
      return newData;
    });

    setBulkEditData({ price: "", stock: "", sku: "" });
    setShowBulkEdit(false);
    setSelectedItems(new Set());
  };

  const generateAllSKUs = () => {
    setData((prev) => {
      return generateSKUsForAllItems(prev, listAttribute);
    });
  };

  // Render bảng với tính năng thu gọn
  const renderVariantTable = () => {
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
                    <label className="block text-sm font-medium mb-1">
                      Giá
                    </label>
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

  return (
    <div key={resetKey}>
      <textarea name={field.name} hidden ref={textareaRef}></textarea>
      {activeVariant && (
        <>
          <label
            htmlFor={field.name}
            className="border border-double flex items-center justify-center cusor-pointer gap-2 p-2 cursor-pointer w-fit mb-2"
            style={{
              color: hasVariant ? "red" : "green",
            }}
          >
            {hasVariant ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" />
                </svg>
                Hủy phân loại
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                Thêm phân loại
              </>
            )}
          </label>
          <input
            type="checkbox"
            id={field.name}
            hidden
            onChange={(e) => setHasVariant(e.target.checked)}
          />
        </>
      )}
      {hasVariant ? (
        <div>
          <div className="flex border p-2 gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                data-name="attribute"
                className="w-full outline-outline outline-4 transition border rounded-md p-2"
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
                placeholder="Thuộc tính"
                ref={inputAddAttributeRef}
                onMouseDown={showProductAttributeAvailable}
              />
              {field.data_product_attributes.length > 0 && showSuggestion && (
                <div
                  className="absolute top-10 left-0 w-full bg-white z-10"
                  ref={suggestionRef}
                >
                  {field.data_product_attributes.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setAttribute(item.name);
                        setShowSuggestion(false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={addAttribute} tabIndex="-1">
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap flex-col gap-2">
            {listAttribute.map((item, index) => (
              <div
                className="p-2 pr-16 relative border"
                key={index}
                onDragEnd={dragEnd}
              >
                <button
                  type="button"
                  onClick={(e) => deleteAttribute(index)}
                  className="absolute top-2 right-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                <input
                  type="text"
                  className="w-full outline-outline outline-4 transition border rounded-md p-2"
                  defaultValue={item.name}
                  onChange={(e) => changeNameAttribute(e, index)}
                />
                {/* Bắt đầu giá trị ở đây */}
                <div className="flex flex-wrap py-2 -my-2 -mx-4">
                  {item.values.map((value, indexValue) => (
                    <div
                      className="flex-[0_0_50%] px-4 py-2 flex item-group"
                      key={indexValue}
                      onDragOver={(e) => dragOver(e, index, indexValue)}
                    >
                      <input
                        type="text"
                        defaultValue={value.value}
                        className="w-full outline-outline outline-4 transition border rounded-md p-2 mr-2"
                        placeholder={value.placeholder}
                        onChange={(e) =>
                          handleChangeValue(e, index, indexValue)
                        }
                      />
                      <button
                        draggable="true"
                        onDragStart={(e) => dragStart(e, index, indexValue)}
                        className="text-gray-500 mr-2"
                        tabIndex="-1"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
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
                        className="text-gray-500"
                        type="button"
                        tabIndex="-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                          <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {data.length > 0 && (
            <>
              {/* Bulk Edit Section */}
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
                        <label className="block text-sm font-medium mb-1">
                          Giá
                        </label>
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

              {/* Render bảng với tính năng thu gọn */}
              {renderVariantTable()}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="mt-2">
            <p className="mb-2">Giá</p>
            <input
              type="text"
              data-name="price"
              value={data[0] ? data[0]?.price : ""}
              placeholder="Giá"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={handleChangePrice}
            />
          </div>
          <div className="mt-2">
            <p className="mb-2">Sku</p>
            <input
              type="text"
              data-name="sku"
              value={data[0] ? data[0]?.sku : ""}
              placeholder="Sku"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={handleChangeSku}
            />
          </div>
          <div className="mt-2">
            <p className="mb-2">Số lượng</p>
            <input
              type="text"
              data-name="stock"
              value={data[0] ? data[0]?.stock : 0}
              placeholder="Số lượng"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={changeStock}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductVariant;