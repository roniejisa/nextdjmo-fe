"use client";
import { ModuleContext } from "@/context/cms/ModuleProvider";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { useContext } from "react";
import { deleteItems } from "../actions";
import { AllContext } from "@/context/cms/AllProvider";

const ActionTable = () => {
  const { module, user, selectIds, setSelectIds, selectAllRef, data } =
    useContext(ModuleContext);
  const { setShowModalQuestion, setModalOptions } = useContext(AllContext);
  const handleShowModalDeleteForm = () => {
    setShowModalQuestion(true);
    setModalOptions({
      title: (
        <span>
          Bạn có chắc chắn muốn xóa {selectIds.length} mục này không ?
        </span>
      ),
      confirm: handleDelete,
    });
  };
  const router = useRouterCustom();
  const notify = useNotify();
  const handleDelete = async () => {
    const response = await deleteItems(module, selectIds);
    notify.changeNotify(
      response.status == 200 ? "success" : "error",
      response.message
    );
    if (response.status == 200) {
      const urlCurrent = window.location.pathname + window.location.search;
      // Reset lại ngay
      setSelectIds((prev) => {
        return [];
      });
      selectAllRef.current.checked = false;
      setShowModalQuestion(false);
      router.push(urlCurrent, true);
    }
  };

  return (
    <>
      {selectIds.length > 0 ? (
        <div className="sticky bottom-0 left-0 w-full p-4 bg-white flex self-start justify-between">
          <div className="flex items-center gap-2">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              className="text-outline"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 12l5 5l10 -10"></path>
              <path d="M2 12l5 5m5 -5l5 -5"></path>
            </svg>
            <span>{selectIds.length} mục được chọn!</span>
          </div>
          <div>
            {user?.permissions.includes(`${module}.delete`) && (
              <button
                className={
                  "text-[#ff6a55] rounded-lg border p-2 border-[#ff6a55]"
                }
                onClick={handleShowModalDeleteForm}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ActionTable;
