"use client";

import { useContext, useEffect, useState } from "react";
import { getData } from "./action";
import { AllContext } from "@/context/cms/AllProvider";

const SelectList = ({ field, oldData, defaultValue }) => {
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");
  const { updateField, setUpdateField } = useContext(AllContext);
  const getListData = async () => {
    const data = await getData(field.module);
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

  useEffect(() => {
    if (list.length > 0 && oldData[field.name] !== undefined) {
      setValue(String(oldData[field.name]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

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
      {list.map((item) => (
        <option
          key={String(item[field.module_id])}
          value={String(item[field.module_id])}
        >
          {item[field.module_label]}
        </option>
      ))}
    </select>
  );
};

export default SelectList;
