"use client";
import { useContext } from "react";
import FormFilter from "./FormFilter";
import { ModuleContext } from "@/context/ModuleProvider";

const HeaderTable = () => {
  const { module, user, selectIds } = useContext(ModuleContext);
  return (
    <>
      <div className="flex justify-end">
        <div>
          <FormFilter />
          
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default HeaderTable;
