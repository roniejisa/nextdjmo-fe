"use client";
import { AllContext } from "@/context/AllProvider";
import { useContext, useRef } from "react";
import { handleDeleteModule } from "./action";
import { useNotify } from "@/context/NotifyProvider";
import { useRouter } from "next/navigation";

const QuestionModal = () => {
  const { showModalQuestion, setShowModalQuestion, modalOptions } =
    useContext(AllContext);
  const router = useRouter();
  const notify = useNotify();
  const modalRef = useRef(null);
  const handleSubmit = async (form) => {
    const response = await handleDeleteModule(
      modalOptions.module,
      modalOptions.item._id
    );
    if (response.status == 200) {
      setShowModalQuestion(false);
      router.refresh();
      notify.changeNotify("success", response.messsage || "Thành công!");
    }
    return false;
  };
  const handleClose = (e) => {
    if (e.target.contains(modalRef.current)) {
      setShowModalQuestion(false);
    }
  };
  return (
    <div
      ref={modalRef}
      onClick={handleClose}
      className="fixed top-0 left-0 w-full z-[9999] transition-opacity duration-300 h-screen bg-[rgba(0,0,0,.2)]"
      style={{
        opacity: showModalQuestion ? 1 : 0,
        visibility: showModalQuestion ? "visible" : "hidden",
        pointerEvents: showModalQuestion ? "all" : "none",
      }}
    >
      {showModalQuestion && (
        <div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-white -translate-y-1/2 p-4 rounded-lg">
            <form action={handleSubmit}>
              <div>
                {modalOptions.question.replaceAll(
                  "__TARGET__",
                  modalOptions.data.name
                )}
              </div>
              <div className="flex justify-center mt-4">

                <button onClick={() => setShowModalQuestion(false)} type="button" className="px-4 rounded-lg border bg-orange-500 text-white mr-2">
                    Hủy
                </button>
                <button className="px-4 border rounded-lg bg-green-600 text-white">Đồng ý</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionModal;
