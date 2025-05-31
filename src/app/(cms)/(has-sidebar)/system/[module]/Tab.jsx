"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

const TabModule = ({ tab }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouterCustom();

  const handleTab = (tab) => {
    const newSeachParams = new URLSearchParams(
      Object.fromEntries(searchParams)
    );
    newSeachParams.set("module", tab);
    const paramsObject = Object.fromEntries(newSeachParams)
    router.pushWithQuery(pathname,paramsObject)
  };
  return (
    <div className="ml-10 flex gap-4">
      {tab.map((item, index) => {
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleTab(item.name)}
            className={`text-xl rounded-md px-4 py-1 ${searchParams.get("module") === item.name ? "text-red-100 bg-red-500" : "text-red-500 bg-red-100"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabModule;
