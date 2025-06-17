"use client";
import { useEffect, useState } from "react";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

const Link = ({ field, value:initialValue, item }) => {
  const [value, setValue] = useState(initialValue || "");
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

  useEffect(() => {
    if (item[field.related]) {
      setModule(item[field.related]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeLink = (e) => {
    const slug = list.find((item) => item._id === e.target.value).slug;
    const dataModule = field.find((item) => item.value == module);
    if (dataModule && dataModule?.prefix) {
      setValue(`${dataModule?.prefix}${slug}`);
    }
  };
  return (
    <div className="flex gap-2">
      <input
        type="text"
        name={field.name}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
        autoComplete="off"
      />
      <select
        name="model"
        onChange={(e) => setModule(e.target.value)}
        value={module}
      >
        <option value="">-- Chọn danh sách --</option>
        <option value="products">Tác phẩm</option>
        <option value="authors">Tác giả</option>
      </select>
      <select
        name="model_id"
        onChange={handleChangeLink}
        value={item[field.related_id]}
      >
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
