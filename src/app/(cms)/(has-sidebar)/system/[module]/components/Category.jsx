"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Category = ({ value, field, item }) => {
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
  const handleChooseCategory = (_id) => {
    setSelected((prev) => {
      if (prev === _id) {
        return null;
      }
      return _id;
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
    let indexFirst = value.findIndex(
      (category) => category[field.module_id] === selected
    );
    if (indexFirst < 0) {
      indexFirst = 0;
    }
    const firstTag = value[indexFirst];
    return (
      <div className="flex flex-wrap gap-2">
        <span
          className={`border border-outline p-1 transition cursor-pointer rounded-lg ${
            selected === firstTag[field.module_id]
              ? "bg-outline text-white"
              : "text-outline hover:bg-outline hover:text-white"
          }`}
          onClick={() => handleChooseCategory(firstTag[field.module_id])}
        >
          {firstTag[field.module_label]}
        </span>
        {value.length - 1 > 0 ? (
          <div className="border border-outline text-outline p-1 rounded-lg group relative">
            +{value.length - 1}
            <div className="absolute top-[calc(100%+10px)] shadow-md group-hover:opacity-100 group-hover:visible group-hover:delay-0 delay-300 transition-all opacity-0 invisible right-0 flex gap-2 flex-wrap w-[300px] bg-white p-4 rounded-md z-[888]">
              {value
                .filter(
                  (item) => item[field.module_id] !== firstTag[field.module_id]
                )
                .map((item, index) => (
                  <span
                    key={index}
                    className={`border border-outline p-1 transition rounded-lg cursor-pointer ${
                      selected === item[field.module_id]
                        ? "bg-outline text-white"
                        : "text-outline hover:bg-outline hover:text-white"
                    }`}
                    onClick={() => handleChooseCategory(item._id)}
                  >
                    {item[field.module_label]}
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

export default Category;
