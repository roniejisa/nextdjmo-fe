"use client";

import { useState } from "react";

const Select = ({ field, value:initalValue }) => {
  const [value, setValue] = useState(initalValue);

  return (
    <select
      name={field.name}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    >
      <option value="">-- Chọn --</option>
      {field.data.map((item) => (
        <option key={String(item.value)} value={String(item.value)}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default Select;