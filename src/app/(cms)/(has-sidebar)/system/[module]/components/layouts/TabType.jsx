"use client";

import ImageCustom from "@/components/Maintain/Image";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const TabType = ({ data, name }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouterCustom();
  const newSeachParams = new URLSearchParams({
    ...Object.fromEntries(searchParams),
  });
  const [selected, setSelected] = useState(newSeachParams.get(name) || "");
  const searchForm = (tab) => {
    if (tab == "") {
      newSeachParams.delete(name);
    } else {
      newSeachParams.set(name, tab);
    }
    setSelected(tab);
    router.push(pathname + "?" + newSeachParams.toString(), true);
  };
  return (
    <div className="flex justify-between">
      <ul className="flex gap-4 mb-4 items-center">
        <li
          className={`border cursor-pointer p-2 rounded-md ${
            selected == "" ? "bg-outline text-white border-outline" : ""
          }`}
          onClick={() => searchForm("")}
        >
          Tất cả
        </li>
        {data.map((tab, index) => {
          return (
            <li
              className={`flex cursor-pointer items-center rounded-md border p-2 gap-2 ${
                selected == tab?.value
                  ? "bg-outline text-white border-outline"
                  : ""
              }`}
              key={index}
              onClick={() => searchForm(tab?.icon)}
            >
              <ImageCustom
                src={`/country/${tab?.icon}.svg`}
                width={20}
                height={10}
              />
              {tab.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TabType;
