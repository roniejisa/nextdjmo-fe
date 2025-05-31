"use client";
import { useEffect, useState } from "react";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

const Link = ({ field, defaultValue }) => {
  console.log(field?.data)
  const [value, setValue] = useState(defaultValue || "");
  const [module, setModule] = useState("");
  const [list, setList] = useState([]);

  const getModuleLink = async () => {
    const token = await getToken();

    const data = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}?fields=_id,name,slug`,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (data.status == 200) {
      setList(data.data.items);
    }
  };
  useEffect(() => {
    if (module) {
      getModuleLink();
    } else {
      setList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);
  const handleChangeLink = (e) => {
    const slug = list.find((item) => item._id === e.target.value).slug;
    const dataModule = field?.data.find((item) => item.value == module);
    if (dataModule && dataModule?.prefix) {
      setValue(`${dataModule?.prefix}${slug}`);
    }
  };
  return (
    <div className="flex gap-2">
      <input
        type="text"
        autoComplete="off"
        name={field.name}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
      />
      <select
        name="model"
        onChange={(e) => setModule(e.target.value)}
        value={module}
      >
        <option value="">-- Chọn danh sách --</option>
        {field?.data.map((item, index) => {
          return <option key={index} value={item?.value}>
            {item?.label}
          </option>;
        })}
      </select>
      <select name="model_id" onChange={handleChangeLink}>
        <option value="">-- Chọn --</option>
        {list.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Link;
