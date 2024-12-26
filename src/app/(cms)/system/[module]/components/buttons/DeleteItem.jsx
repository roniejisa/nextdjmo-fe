"use client";

import { AllContext } from "@/context/AllProvider";
import { useContext } from "react";

const DeleteItem = ({ children, item, module, data }) => {
  const { setShowModalQuestion, setModalOptions } = useContext(AllContext);
  const handleShowModalDeleteForm = () => {
    setShowModalQuestion(true);
    setModalOptions({
      item,
      module,
      data,
      question: "Bạn có chắc chắn muốn xóa __TARGET__ này không ?",
    });
  };
  return (
    <button
      className="ml-2 bg-red-600 text-white px-2 py-1 rounded-md"
      onClick={handleShowModalDeleteForm}
    >
      {children}
    </button>
  );
};

export default DeleteItem;
