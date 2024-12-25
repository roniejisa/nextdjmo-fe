"use client";
import { useEffect, useState } from "react";
import Group from "./Group";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

const groupPrefix = {
  products: "tac-pham/",
  authors: "tac-gia/",
};

const Link = ({ field, defaultValue }) => {
  const [value, setValue] = useState(defaultValue || "");
  const [group, setGroup] = useState("");
  const [list, setList] = useState([]);

  const getGroupLink = async () => {
    const token = await getToken();

    const data = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + `${group}?fields=_id,name,slug`,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (data.status == 200) {
      setList(data.data.items);
    }
  };
  useEffect(() => {
    if (group) {
      getGroupLink();
    } else {
      setList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);
  const handleChangeLink = (e) => {
    const slug = list.find((item) => item._id === e.target.value).slug;
    setValue(`${groupPrefix[group]}${slug}`);
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
      />
      <select name="model" onChange={(e) => setGroup(e.target.value)}>
        <option value="">-- Chọn danh sách --</option>
        <option value="products">Tác phẩm</option>
        <option value="authors">Tác giả</option>
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
