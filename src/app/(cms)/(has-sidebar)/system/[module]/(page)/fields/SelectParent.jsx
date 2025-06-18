"use client";

import React, { useEffect, useState } from "react";
import { getDataParent } from "./action";
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
        [listField.field_label]: `${"♾️".repeat(level)}${
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

const RecursiveSelect = ({ options, field, ...props }) => {
  const renderOptions = (options, level = 0) => {
    return options.map((option) => (
      <React.Fragment key={option[field.module_id]}>
        {/* Render option với dấu "-" thụt lề */}
        <option value={option[field.module_id]}>
          {/* {`${"-".repeat(level * 2)}  */}
          {option[field.module_label]}
          {/* `} */}
        </option>

        {/* Nếu có children thì render đệ quy */}
        {option.children &&
          option.children.length > 0 &&
          renderOptions(option.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <select {...props}>
      <option value="">Cấp cao nhất</option>
      {renderOptions(options)}
    </select>
  );
};
const SelectParent = ({ value:initialValue, item, field }) => {
  const [list, setList] = useState([]);
  const [value, setValue] = useState(initialValue);

  const getListData = async () => {
    const data = await getDataParent(field.module, item, field);
    if (data.status == 200) {
      const list = buildHierarchy(data.data.items, {
        field_id: field.module_id,
        field_label: field.module_label,
        field_parent_id: field.name,
      });
      setList(list);
    }
  };
  useEffect(() => {
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <RecursiveSelect
      options={list}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
      name={field.name}
      field={field}
      value={value || ""}
      onChange={handleChange}
    />
  );
};

export default SelectParent;
