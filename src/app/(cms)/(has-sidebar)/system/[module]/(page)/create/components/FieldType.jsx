"use client";
import { useState } from "react";

const FieldType = ({ defaultValue, field }) => {
  const [hasSetting, setHasSetting] = useState(false);
  const handleChangeField = (e) => {
    const optionCurrent = e.target[e.target.selectedIndex];
    if (optionCurrent.getAttribute("has-setting")) {
      setHasSetting(true);
    } else {
      setHasSetting(false);
    }
  };

  return (
    <select
      name={field.name}
      onChange={handleChangeField}
      defaultValue={defaultValue || ""}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    >
      <option value="text">Ghi chú</option>
      <option value="textarea">Nội dung ngắn</option>
      <option value="editor">Editor</option>
      <option value="image">Ảnh</option>
      <option value="list_image">Thư viện ảnh</option>
      <option value="bool">Bật/ Tắt</option>
      <option value="date">Ngày tháng</option>
      <option value="repeat">Lặp lại</option>
    </select>
  );
};

export default FieldType;
