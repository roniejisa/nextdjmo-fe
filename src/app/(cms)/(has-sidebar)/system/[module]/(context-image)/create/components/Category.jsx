"use client";

import { AllContext } from "@/context/cms/AllProvider";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getData } from "../../create/components/action";

function buildHierarchy(categories, listField) {
  // Biến đổi dữ liệu thành đối tượng có key là _id để dễ dàng truy cập
  const categoryMap = categories.reduce((acc, category) => {
    acc[category[listField.field_id]] = { ...category, children: [] };
    return acc;
  }, {});

  const result = [];

  // Duyệt qua các danh mục và phân cấp
  categories.forEach((category) => {
    const {
      [listField.field_parent_id]: post_category_id,
      [listField.field_id]: _id,
    } = category;

    // Nếu là danh mục gốc (không có parent)
    if (post_category_id === "") {
      result.push(categoryMap[_id]);
    } else {
      // Nếu có danh mục cha, thêm nó vào danh mục cha
      if (categoryMap[post_category_id]) {
        categoryMap[post_category_id].children.push(categoryMap[_id]);
      }
    }
  });

  // Đệ quy để phân cấp và thêm dấu '--'
  function addPrefix(categories, level = 0) {
    return categories.map((category) => {
      const newCategory = {
        ...category,
        [listField.field_label]: `${"".repeat(level)}${
          category[listField.field_label]
        }`,
      };
      if (category.children.length > 0) {
        newCategory.children = addPrefix(category.children, level + 1); // Đệ quy vào các danh mục con
      }
      return newCategory;
    });
  }

  // Đảm bảo phân cấp và thêm dấu '--'
  return addPrefix(result);
}
const RecursiveCategory = ({ options, field, value, ...props }) => {
  const textareaRef = useRef();
  const inputsRef = useRef({});
  const handleShowChildren = (e) => {
    const catalogChild = e.target.parentElement.nextElementSibling;
    if (catalogChild.classList.contains("hidden")) {
      e.target.innerHTML = "-"
      catalogChild.classList.remove("hidden");
    } else {
      e.target.innerHTML = "+"
      catalogChild.classList.add("hidden");
    }
  };

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

  const updateValue = () => {
    textareaRef.current.value = JSON.stringify(
      Object.values(inputsRef.current)
        .filter((input) => input.checked)
        .map((input) => input.value)
    );
  };
  const renderOptions = (options, level = 0) => {
    return options.map((option) => {
      const checkHasChild = option.children && option.children.length > 0;
      const checkChildHasValue =
        checkHasChild &&
        option.children.some((child) => {
          return value.includes(child[field.module_id]);
        });
      return (
        <li
          key={option[field.module_id]}
          style={{ marginLeft: level > 0 ? `20px` : "" }}
        >
          <label className="cursor-pointer mb-2 block">
            {/* Render option với dấu "-" thụt lề */}
            <div className="flex items-center gap-2">
              <div className="flex-1 border py-1 pl-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  value={option[field.module_id]}
                  defaultChecked={value.includes(option[field.module_id])}
                  onChange={handleChooseCategory}
                  ref={(el) =>
                    (inputsRef.current[option[field.module_id]] = el)
                  }
                />
                {option[field.module_label]}
              </div>
              {checkHasChild && (
                <button
                  type="button"
                  className="px-4 py-1 border"
                  onClick={handleShowChildren}
                >
                  +
                </button>
              )}
            </div>
            {/* Nếu có children thì render đệ quy */}
            <ul className={checkChildHasValue ? "" : "hidden"}>
              {option.children &&
                option.children.length > 0 &&
                renderOptions(option.children, level + 1)}
            </ul>
          </label>
        </li>
      );
    });
  };

  return (
    <div {...props}>
      <textarea
        ref={textareaRef}
        name={field.name}
        defaultValue={value}
        className="hidden"
      ></textarea>
      <ul>{renderOptions(options)}</ul>
    </div>
  );
};
const Category = ({ field, defaultValue }) => {
  const [items, setItems] = useState(field.data);
  const { updateField, setUpdateField } = useContext(AllContext);
  const getListData = async () => {
    const data = await getData(field.module, [
      field.module_id,
      field.module_parent_id,
      field.module_label,
    ]);
    if (data.status == 200) {
      setItems(data.data.items);
    }
    if (updateField == field.name) {
      setUpdateField(null);
    }
  };

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

  let value = field?.value || [];
  return (
    <div>
      <RecursiveCategory
        options={options}
        field={field}
        value={value}
        className="max-h-[200px] overflow-auto"
      />
    </div>
  );
};

export default Category;