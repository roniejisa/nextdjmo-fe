"use client";
import { useContext, useState } from "react";
import { CMSContext } from "@/context/cms/CMSProvider";

const Group = ({ children, field: { label, hasCreateQuick, name, className } }) => {
  const { modalQuick, setModalQuick } = useContext(CMSContext);
  const handleCreate = () => {
    setModalQuick({
      name: name,
      module: hasCreateQuick,
    });
  };

  return (
    <div className={`mt-4 ${className ?? ""}`}>
      {hasCreateQuick ? (
        <div className="flex items-center mb-2">
          <label className="block">{label}</label>
          <button
            type="button"
            onClick={handleCreate}
            className="border rounded-md ml-4 p-1 bg-green-100 border-green-100 text-green-500 transition-all duration-300 hover:bg-green-500 hover:text-white"
          >
            Thêm nhanh
          </button>
        </div>
      ) : (
        <label className="block mb-2">{label}</label>
      )}

      {children}
    </div>
  );
};

export default Group;
