"use client";

import { useEffect, useState } from "react";
import { getData } from "./action";

const SelectParent = ({ defaultValue, item, field }) => {
  const [list, setList] = useState([]);
  const [value, setValue] = useState(defaultValue);
  const getListData = async () => {
    const data = await getData(field.module, item, field);
    if (data.status == 200) {
      setList(data.data.items);
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
    <select
      name={field.name}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
      value={value || ""}
      onChange={handleChange}
    >
      <option value="">-- Chọn --</option>
      {list
        .filter((itemList) => itemList[field.module_id] != item._id)
        .map((itemList) => (
          <option
            key={itemList[field.module_id]}
            value={itemList[field.module_id]}
          >
            {itemList[field.module_label]}
          </option>
        ))}
    </select>
  );
};

export default SelectParent;
