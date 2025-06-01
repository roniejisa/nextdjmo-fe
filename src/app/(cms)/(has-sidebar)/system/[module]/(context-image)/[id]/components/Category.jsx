"use client";

import { AllContext } from "@/context/cms/AllProvider";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getData } from "../../create/components/action";

// Utility function - giữ nguyên logic
function buildHierarchy(categories, listField) {
  const categoryMap = categories.reduce((acc, category) => {
    acc[category[listField.field_id]] = { ...category, children: [] };
    return acc;
  }, {});

  const result = [];

  categories.forEach((category) => {
    const {
      [listField.field_parent_id]: post_category_id,
      [listField.field_id]: _id,
    } = category;

    if (post_category_id === "") {
      result.push(categoryMap[_id]);
    } else {
      if (categoryMap[post_category_id]) {
        categoryMap[post_category_id].children.push(categoryMap[_id]);
      }
    }
  });

  function addPrefix(categories, level = 0) {
    return categories.map((category) => {
      const newCategory = {
        ...category,
        [listField.field_label]: `${"".repeat(level)}${
          category[listField.field_label]
        }`,
      };
      if (category.children.length > 0) {
        newCategory.children = addPrefix(category.children, level + 1);
      }
      return newCategory;
    });
  }

  return addPrefix(result);
}

// Toggle Button Component
const ToggleButton = ({ hasChildren, onClick, hasSelectedChild }) => {
  if (!hasChildren) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                 border border-gray-300 rounded-md hover:bg-gray-50 
                 transition-colors duration-200 text-gray-600 hover:text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      {hasSelectedChild ? "-" : "+"}
    </button>
  );
};

// Category Item Component
const CategoryItem = ({
  option,
  field,
  value,
  level,
  inputsRef,
  onChooseCategory,
  onShowChildren,
}) => {
  const hasChildren = option.children && option.children.length > 0;
  const hasSelectedChild =
    hasChildren &&
    option.children.some((child) => value.includes(child[field.module_id]));

  return (
    <li className={`${level > 0 ? "ml-6" : ""} mb-2`}>
      <label className="cursor-pointer block group">
        <div
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg 
                        hover:border-gray-300 hover:bg-gray-50 transition-all duration-200
                        group-hover:shadow-sm"
        >
          {/* Checkbox và Label */}
          <div className="flex items-center flex-1 gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded 
                         focus:ring-blue-500 focus:ring-2 cursor-pointer
                         transition-colors duration-200"
              value={option[field.module_id]}
              defaultChecked={value.includes(option[field.module_id])}
              onChange={onChooseCategory}
              ref={(el) => (inputsRef.current[option[field.module_id]] = el)}
            />

            <span
              className="text-sm font-medium text-gray-700 select-none 
                           group-hover:text-gray-900 transition-colors duration-200"
            >
              {option[field.module_label]}
            </span>
          </div>

          {/* Toggle Button */}
          <ToggleButton
            hasChildren={hasChildren}
            onClick={onShowChildren}
            hasSelectedChild={hasSelectedChild}
          />
        </div>

        {/* Children - giữ nguyên logic hiển thị */}
        {hasChildren && (
          <ul
            className={`mt-2 ml-4 pl-4 border-l-2 border-gray-100 
                         ${hasSelectedChild ? "" : "hidden"}`}
          >
            {option.children.map((child) => (
              <CategoryItem
                key={child[field.module_id]}
                option={child}
                field={field}
                value={value}
                level={level + 1}
                inputsRef={inputsRef}
                onChooseCategory={onChooseCategory}
                onShowChildren={onShowChildren}
              />
            ))}
          </ul>
        )}
      </label>
    </li>
  );
};

// Main Recursive Category Component
const RecursiveCategory = ({ options, field, value, ...props }) => {
  const textareaRef = useRef();
  const inputsRef = useRef({});

  // Giữ nguyên logic handleShowChildren
  const handleShowChildren = (e) => {
    const catalogChild = e.target.parentElement?.nextElementSibling;
    if (catalogChild?.classList.contains("hidden")) {
      e.target.innerHTML = "-";
      catalogChild?.classList.remove("hidden");
    } else {
      e.target.innerHTML = "+";
      catalogChild?.classList.add("hidden");
    }
  };

  // Giữ nguyên logic handleChooseCategory
  const handleChooseCategory = (e) => {
    const checked = e.target.checked;
    if (checked) {
      findParentElement(e.target);
    } else {
      findChildElement(e.target);
    }

    function findChildElement(el) {
      const label = el.closest("label");
      const inputs = label.querySelectorAll("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
      }
    }

    function findParentElement(el) {
      const ul = el.closest("ul");
      if (ul && ul.closest("li") !== null) {
        const li = ul.closest("li");
        const checkbox = li.querySelector("input");
        checkbox.checked = checked;
        findParentElement(checkbox);
      }
    }
    updateValue();
  };

  // Giữ nguyên logic updateValue
  const updateValue = () => {
    textareaRef.current.value = JSON.stringify(
      Object.values(inputsRef.current)
        .filter((input) => input.checked)
        .map((input) => input.value)
    );
  };

  // Giữ nguyên logic renderOptions nhưng sử dụng CategoryItem component
  const renderOptions = (options, level = 0) => {
    return options.map((option) => {
      return (
        <CategoryItem
          key={option[field.module_id]}
          option={option}
          field={field}
          value={value}
          level={level}
          inputsRef={inputsRef}
          onChooseCategory={handleChooseCategory}
          onShowChildren={handleShowChildren}
        />
      );
    });
  };

  return (
    <div {...props} className={`${props.className || ""}`}>
      {/* Giữ nguyên textarea với defaultValue là JSON.stringify(value) */}
      <textarea
        ref={textareaRef}
        name={field.name}
        defaultValue={JSON.stringify(value)}
        className="hidden"
      />

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4">
          <ul className="space-y-1">{renderOptions(options)}</ul>
        </div>
      </div>
    </div>
  );
};

// Main Category Component
const Category = ({ field, defaultValue }) => {
  const [items, setItems] = useState(field.data);
  const [isLoading, setIsLoading] = useState(false);
  const { updateField, setUpdateField } = useContext(AllContext);

  // Giữ nguyên logic getListData
  const getListData = async () => {
    setIsLoading(true);
    try {
      const data = await getData(field.module, [
        field.module_id,
        field.module_parent_id,
        field.module_label,
      ]);

      if (data.status == 200) {
        setItems(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
      setIsLoading(false);
      if (updateField == field.name) {
        setUpdateField(null);
      }
    }
  };

  // Giữ nguyên logic useEffect
  useEffect(() => {
    if (field.name == updateField && updateField) {
      getListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField]);

  const options = buildHierarchy(items, {
    field_id: field.module_id,
    field_label: field.module_label,
    field_parent_id: field.module_parent_id,
  });

  // Giữ nguyên logic value
  let value = field?.value || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Đang tải danh mục...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <RecursiveCategory
        options={options}
        field={field}
        value={value}
        className="max-h-80 overflow-auto"
      />
    </div>
  );
};

export default Category;
