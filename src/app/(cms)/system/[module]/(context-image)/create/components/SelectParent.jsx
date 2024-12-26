"use client";

import { useEffect, useState } from "react";
import { getData } from "./action";

const SelectParent = ({ field }) => {
  const [list, setList] = useState([]);
  const getListData = async () => {
    const data = await getData(field.module);
    if (data.status == 200) {
      setList(data.data.items);
    }
  };
  useEffect(() => {
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <select
      name={field.name}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    >
      <option value="">-- Chọn --</option>
      {list.map((item) => (
        <option key={item[field.module_id]} value={item[field.module_id]}>
          {item[field.module_label]}
        </option>
      ))}
    </select>
  );
};

export default SelectParent;
