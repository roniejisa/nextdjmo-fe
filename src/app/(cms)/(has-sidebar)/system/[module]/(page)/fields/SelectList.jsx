"use client";

import { useContext, useEffect, useState } from "react";
import { selectList } from "./action";
import { CMSContext } from "@/context/cms/CMSProvider";

const SelectList = ({ value: initalValue, item, field }) => {
  const [list, setList] = useState([]);
  const [value, setValue] = useState(initalValue);
  const { updateField, setUpdateField } = useContext(CMSContext);

  const getListData = async () => {
    const data = await selectList(field.module, item, field);
    console.log(data)
    if (data.status == 200) {
      setList(data.data.items);
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
        .filter((itemList) => itemList[field.module_id] != item?._id)
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

export default SelectList;
