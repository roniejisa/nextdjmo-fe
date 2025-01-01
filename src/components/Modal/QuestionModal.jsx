"use client";
import { AllContext } from "@/context/AllProvider";
import { useContext, useRef } from "react";
import { handleDeleteModule } from "./action";
import { useNotify } from "@/context/NotifyProvider";
import { useRouter } from "next/navigation";

const QuestionModal = () => {
  const { showModalQuestion, setShowModalQuestion, modalOptions } =
    useContext(AllContext);
  const modalRef = useRef(null);
  const handleSubmit = async (form) => {
    modalOptions.confirm();
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
      className="fixed top-0 left-0 w-full z-[9999] transition-all duration-300 h-screen bg-[rgba(0,0,0,.2)]"
      style={{
        opacity: showModalQuestion ? 1 : 0,
        visibility: showModalQuestion ? "visible" : "hidden",
        pointerEvents: showModalQuestion ? "all" : "none",
        backdropFilter: "blur(12px)",
        transitionDelay: showModalQuestion ? "0" : "300ms"
      }}
    >
      <div
        
      >
        <div className="absolute top-1/2 left-1/2 transition-all duration-300 -translate-x-1/2 bg-white -translate-y-1/2 p-4 rounded-lg" style={{
          opacity: showModalQuestion ? 1 : 0,
          visibility: showModalQuestion ? "visible" : "hidden",
          pointerEvents: showModalQuestion ? "all" : "none",
          scale: showModalQuestion ? 1 : 0,
          transformOrigin:"top left"
        }}>
          <form action={handleSubmit}>
            <div>
              {typeof modalOptions === "object" && modalOptions.question ? modalOptions.question.replaceAll(
                "__TARGET__",
                modalOptions.data.name
              ) : ""}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModalQuestion(false)}
                type="button"
                className="px-4 rounded-lg text-gray-400 hover:text-black transition py-2 mr-2"
              >
                Hủy
              </button>
              <button className="px-4 border rounded-lg bg-outline transition hover:text-outline hover:bg-white border-outline text-white py-2">
                Đồng ý
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
