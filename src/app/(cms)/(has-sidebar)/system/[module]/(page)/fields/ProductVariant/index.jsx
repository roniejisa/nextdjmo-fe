/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { makeId } from "@/utils/client";
import RenderVariantTable from "./components/RenderVariantTable";
import AttributeInput from "./components/AttributeInput";
import NoVariant from "./components/NoVariant";
import ButtonActiveVariant from "./components/ButtonActiveVariant";
import BulkEditSection from "./components/BulkEditSection";
import AttributeListRender from "./components/AttributeListRender";
import {
  generateCombinations,
  generateKey,
  generateSKU,
  sortData,
} from "./utils";
import { useNotify } from "@/context/NotifyProvider";

const ProductVariant = ({ field, item, value }) => {
  const initialData = useMemo(() => (value ? JSON.parse(value) : {}), [value]);
  const [hasVariant, setHasVariant] = useState(false);
  const [attribute, setAttribute] = useState("");

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
  const oldValue = useRef(null);
  const inputAddAttributeRef = useRef(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const suggestionRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(value);
  const [resetKey, setResetKey] = useState(0);
  const notify = useNotify();

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

  const checkDuplicateSKU = (newSKU, currentIndex = -1) => {
    return data.some(
      (item, index) => index !== currentIndex && item.sku === newSKU
    );
  };

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

  const toggleGroupCollapse = (groupKey) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupKey)) {
      newCollapsed.delete(groupKey);
    } else {
      newCollapsed.add(groupKey);
    }
    setCollapsedGroups(newCollapsed);
  };

  const toggleAllGroups = () => {
    const allGroupKeys = Object.keys(groupedData);
    if (collapsedGroups.size === allGroupKeys.length) {
      setCollapsedGroups(new Set());
    } else {
      setCollapsedGroups(new Set(allGroupKeys));
    }
  };

  const selectGroup = (groupKey) => {
    const groupItems = groupedData[groupKey] || [];
    const newSelected = new Set(selectedItems);

    const isAllSelected = groupItems.every((item) =>
      newSelected.has(item.originalIndex)
    );

    if (isAllSelected) {
      groupItems.forEach((item) => {
        newSelected.delete(item.originalIndex);
      });
    } else {
      groupItems.forEach((item) => {
        newSelected.add(item.originalIndex);
      });
    }

    setSelectedItems(newSelected);
  };

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
      notify.changeNotify("error", "Không có sản phẩm nào để chỉnh sửa!");
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

  const dragEnd = (e) => {
    e.preventDefault();
    setTimeout(() => {
      dataMoveRef.current = null;
    }, 100);
  };

  const dragStart = (e, index, indexValue) => {
    dataMoveRef.current = {
      ...listAttribute[index].values[indexValue],
      index: indexValue,
      attribute_id: index,
    };

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");

    e.target.closest(".item-group")?.classList.add("dragging");
  };

  const dragOver = (e, index, indexNew) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dataMoveRef.current) return;

    const indexOld = dataMoveRef.current.index;
    const attributeOld = dataMoveRef.current.attribute_id;

    if (attributeOld !== index || indexOld === indexNew) return;

  };

  const handleDrop = (e, index, indexNew) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dataMoveRef.current) return;

    const indexOld = dataMoveRef.current.index;
    const attributeOld = dataMoveRef.current.attribute_id;

    // Kiểm tra điều kiện drop hợp lệ
    if (attributeOld !== index || indexOld === indexNew) {
      dataMoveRef.current = null;
      return;
    }

    setListAttribute((prev) => {
      const newList = [...prev];
      const listIndexCurrent = [...newList[index].values];
      const valueMove = listIndexCurrent[indexOld];

      // Remove từ vị trí cũ
      listIndexCurrent.splice(indexOld, 1);
      // Insert vào vị trí mới
      listIndexCurrent.splice(indexNew, 0, valueMove);

      newList[index] = {
        ...newList[index],
        values: listIndexCurrent,
      };
      return newList;
    });

    // Reset drag data
    dataMoveRef.current = null;
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
          notify.changeNotify(
            "error",
            "SKU đã tồn tại! Vui lòng nhập SKU khác."
          );
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
      notify.changeNotify("error", "SKU đã tồn tại! Vui lòng nhập SKU khác.");
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
      notify.changeNotify(
        "error",
        "Vui lòng chọn ít nhất một sản phẩm để chỉnh sửa!"
      );
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
    const allGroupKeys = Object.keys(groupedData);
    setCollapsedGroups(new Set(allGroupKeys));
  }, [value]);

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
  }, [listAttribute, value]);

  return (
    <div key={resetKey}>
      <textarea name={field.name} hidden ref={textareaRef}></textarea>
      <ButtonActiveVariant
        field={field}
        setHasVariant={setHasVariant}
        hasVariant={hasVariant}
      />
      {hasVariant ? (
        <div>
          <AttributeInput
            addAttribute={addAttribute}
            attribute={attribute}
            field={field}
            inputAddAttributeRef={inputAddAttributeRef}
            setAttribute={setAttribute}
            setShowSuggestion={setShowSuggestion}
            showProductAttributeAvailable={showProductAttributeAvailable}
            suggestionRef={suggestionRef}
            showSuggestion={showSuggestion}
          />
          <AttributeListRender
            listAttribute={listAttribute}
            dragEnd={dragEnd}
            deleteAttribute={deleteAttribute}
            changeNameAttribute={changeNameAttribute}
            handleDrop={handleDrop}
            dragOver={dragOver}
            handleChangeValue={handleChangeValue}
            dragStart={dragStart}
            deleteAttributeValue={deleteAttributeValue}
          />
          {data.length > 0 && (
            <>
              {/* Bulk Edit Section */}
              <BulkEditSection
                bulkEditData={bulkEditData}
                data={data}
                handleBulkEdit={handleBulkEdit}
                handleSelectAll={handleSelectAll}
                showBulkEdit={showBulkEdit}
                setShowBulkEdit={setShowBulkEdit}
                setBulkEditData={setBulkEditData}
                generateAllSKUs={generateAllSKUs}
                selectedItems={selectedItems}
              />

              {/* Render bảng với tính năng thu gọn */}
              <RenderVariantTable
                changeData={changeData}
                collapsedGroups={collapsedGroups}
                data={data}
                filteredData={filteredData}
                groupedData={groupedData}
                handleSelectItem={handleSelectItem}
                listAttribute={listAttribute}
                selectGroup={selectGroup}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                toggleAllGroups={toggleAllGroups}
                toggleGroupCollapse={toggleGroupCollapse}
                attributeFilters={attributeFilters}
                bulkEditMode={bulkEditMode}
                generateAllSKUs={generateAllSKUs}
                showAdvancedBulkEdit={showAdvancedBulkEdit}
                oldValue={oldValue}
                upImageForData={upImageForData}
                setShowAdvancedBulkEdit={setShowAdvancedBulkEdit}
                bulkEditData={bulkEditData}
                setBulkEditData={setBulkEditData}
                handleAdvancedBulkEdit={handleAdvancedBulkEdit}
                setAttributeFilters={setAttributeFilters}
                setBulkEditMode={setBulkEditMode}
              />
            </>
          )}
        </div>
      ) : (
        <NoVariant
          changeStock={changeStock}
          data={data}
          handleChangePrice={handleChangePrice}
          handleChangeSku={handleChangeSku}
        />
      )}
    </div>
  );
};

export default ProductVariant;
