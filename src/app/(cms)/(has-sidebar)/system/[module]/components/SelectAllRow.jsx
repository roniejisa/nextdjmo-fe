"use client";

import { ModuleContext } from "@/context/ModuleProvider";
import { useContext } from "react";

const SelectAllRow = () => {
  const { selectRef, selectAllRef, setSelectIds } = useContext(ModuleContext);
  const handleChange = (e) => {
    const checked = e.target.checked;
    selectRef.current.forEach((selectItem) => {
      selectItem.el.checked = checked;
    });

    setSelectIds(
      selectRef.current
        .filter((selectItem) => selectItem.el.checked)
        .map((selectItem) => selectItem.id)
    );
  };
  return (
    <div className="flex-[0_0_60px]">
      <label className="flex h-full w-full cursor-pointer justify-center items-center">
        <span className="relative h-5 block">
          <input
            type="checkbox"
            ref={selectAllRef}
            onChange={handleChange}
            className="w-5 h-5 peer rounded-[4px] checked:bg-outline checked:border-outline border-[#d4d4d4] border cursor-pointer appearance-none"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 stroke-neutral fill-neutral opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 mt-[1.25px]"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
      </label>
    </div>
  );
};

export default SelectAllRow;
