"use client";

import ImageCustom from "@/components/Maintain/Image";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const SelectType = ({ data, name }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouterCustom();
  const newSeachParams = new URLSearchParams({
    ...Object.fromEntries(searchParams),
  });
  const [selected, setSelected] = useState(newSeachParams.get(name) || "");
  const searchForm = (value) => {
    if (value == "") {
      newSeachParams.delete(name);
    } else {
      newSeachParams.set(name, value);
    }
    setSelected(value);
    router.push(pathname + "?" + newSeachParams.toString(), true);
  };
  return (
    <div className="flex justify-between">
      <select value={selected} onChange={(e) => searchForm(e.target.value)}>
        <option value="">Tất cả</option>
        {data.map((tab, index) => {
          return (
            <option value={tab.value} key={index}>
              {tab.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectType;
