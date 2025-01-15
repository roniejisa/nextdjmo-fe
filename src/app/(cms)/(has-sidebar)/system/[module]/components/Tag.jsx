"use client";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Tag = ({ value, field }) => {
  const router = useRouterCustom();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selected, setSelected] = useState(() => {
    if (searchParams.get(field.name)) {
      return searchParams.get(field.name);
    } else {
      return null;
    }
  });
  const [isInitialRender, setIsInitialRender] = useState(true);

  const handleChooseTag = (label) => {
    setSelected((prev) => {
      if (prev == label) {
        return null;
      }
      return label;
    });
  };
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    let newSeachParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
    });
    let url;
    if (selected) {
      newSeachParams.set(field.name, selected);
    } else {
      newSeachParams.delete(field.name);
    }
    url = `${pathname}${
      newSeachParams.toString() ? "?" + newSeachParams.toString() : ""
    }`;
    router.push(url, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);
  if (value && Array.isArray(value) && value.length > 0) {
    let indexFirst = value.findIndex((item) => item === selected);
    if (indexFirst === -1) {
      indexFirst = 0;
    }
    const firstTag = value[indexFirst];
    return (
      <div className="flex flex-wrap gap-2">
        <span
          className={`border border-outline transition ${
            selected === firstTag
              ? "bg-outline text-white"
              : "text-outline hover:bg-outline hover:text-white"
          } p-1 cursor-pointer rounded-lg`}
          onClick={() => handleChooseTag(firstTag)}
        >
          {firstTag}
        </span>
        {value.length - 1 > 0 ? (
          <div className="border border-outline text-outline p-1 rounded-lg group relative">
            +{value.length - 1}
            <div className="absolute top-[calc(100%+10px)] shadow-md group-hover:opacity-100 group-hover:visible group-hover:delay-0 delay-300 transition-all opacity-0 invisible right-0 flex gap-2 flex-wrap w-[300px] bg-white p-4 rounded-md z-[888]">
              {value
                .filter((item) => item !== firstTag)
                .map((item, index) => (
                  <span
                    key={index}
                    className={`border border-outline transition ${
                      selected === item
                        ? "bg-outline text-white"
                        : "text-outline hover:bg-outline hover:text-white"
                    } p-1 cursor-pointer rounded-lg `}
                    onClick={() => handleChooseTag(item)}
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return <div>Không có {field.label}</div>;
  }
};

export default Tag