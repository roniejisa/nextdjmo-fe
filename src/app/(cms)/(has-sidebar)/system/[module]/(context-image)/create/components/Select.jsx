"use client";

import { useState } from "react";

const Select = ({ field, defaultValue }) => {
  const [selected, setSelected] = useState(field?.default || defaultValue);

  return (
    <select
      name={field.name}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
      value={selected}
      onChange={(e) => {
        setSelected(e.target.value);
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