"use client";

import { handleDeleteModule } from "@/components/Modal/action";
import TooltipText from "@/components/Tooltip/Text";
import { CMSContext } from "@/context/cms/CMSProvider";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { useContext } from "react";

const DeleteItem = ({ item, module, data, action }) => {
  const { setShowModalQuestion, setModalOptions } = useContext(CMSContext);
  const router = useRouterCustom();
  const notify = useNotify();
  const handleShowModalDeleteForm = () => {
    setShowModalQuestion(true);
    setModalOptions({
      title: <span>Bạn có chắc chắn muốn xóa {data.name} này không ?</span>,
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
      className="ml-2 text-gray-500 px-2 py-1 rounded-md"
      onClick={handleShowModalDeleteForm}
    >
      <TooltipText label={action.label}>
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
          <path d="M4 7l16 0" />
          <path d="M10 11l0 6" />
          <path d="M14 11l0 6" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </TooltipText>
    </button>
  );
};

export default DeleteItem;
