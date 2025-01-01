"use client";

import { handleDeleteModule } from "@/components/Modal/action";
import { AllContext } from "@/context/AllProvider";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { useContext } from "react";

const DeleteItem = ({ children, item, module, data }) => {
  const { setShowModalQuestion, setModalOptions } = useContext(AllContext);
  const router = useRouterCustom();
  const notify = useNotify();
  const handleShowModalDeleteForm = () => {
    setShowModalQuestion(true);
    setModalOptions({
      item,
      module,
      data,
      question: "Bạn có chắc chắn muốn xóa __TARGET__ này không ?",
      confirm: async () => {
        const response = await handleDeleteModule(module, item._id);
        if (
          response.status == 204 ||
          response.status == 200 ||
          response.status == 201
        ) {
          setShowModalQuestion(false);
          router.refresh();
          notify.changeNotify("success", response?.message || "Thành công!");
        }
        return false;
      },
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
