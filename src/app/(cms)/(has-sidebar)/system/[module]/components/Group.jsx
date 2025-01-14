"use client";
import { useContext, useState } from "react";
import { AllContext } from "@/context/cms/AllProvider";

const Group = ({ children, field: { label, hasCreateQuick, name } }) => {
  const { modalQuick, setModalQuick } = useContext(AllContext);
  const handleCreate = () => {
    setModalQuick({
      name: name,
      module: hasCreateQuick,
    });
  };

  return (
    <div className="mt-4">
      {hasCreateQuick ? (
        <div className="flex items-center mb-2">
          <label className="block">{label}</label>
          <button
            type="button"
            onClick={handleCreate}
            className="border rounded-md ml-4 p-1 bg-green-300 hover:bg-green-500 hover:text-white"
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
