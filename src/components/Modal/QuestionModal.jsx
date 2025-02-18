"use client";
import { AllContext } from "@/context/cms/AllProvider";
import { useContext, useRef } from "react";
import CloseIcon from "../Icon/svg/Close";

const QuestionModal = () => {
  const { showModalQuestion, setShowModalQuestion, modalOptions } =
    useContext(AllContext);
  const modalRef = useRef(null);
  const handleSubmit = async (form) => {
    modalOptions.confirm(form);
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
        transitionDelay: showModalQuestion ? "0" : "300ms",
      }}
    >
      <div>
        <div
          className="absolute top-1/2 left-1/2 transition-all duration-300 -translate-x-1/2 bg-white -translate-y-1/2 p-4 rounded-lg"
          style={{
            opacity: showModalQuestion ? 1 : 0,
            visibility: showModalQuestion ? "visible" : "hidden",
            pointerEvents: showModalQuestion ? "all" : "none",
            scale: showModalQuestion ? 1 : 0,
            transformOrigin: "top left",
          }}
        >
          <button
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 transition p-2 rounded-full"
            onClick={() => setShowModalQuestion(false)}
          >
            <CloseIcon className="w-4 h-4 text-gray-400" />
          </button>
          <form action={handleSubmit}>
            <div className="text-xl font-bold mb-4 pr-12">
              {modalOptions?.title && modalOptions.title}
            </div>
            {modalOptions?.component && modalOptions.component}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModalQuestion(false)}
                type="button"
                className="px-4 rounded-lg text-gray-400 hover:text-black transition py-2 mr-2"
              >
                {modalOptions?.btnCancel || "Hủy"}
              </button>
              <button className="px-4 border rounded-lg bg-outline transition hover:text-outline hover:bg-white border-outline text-white py-2">
                {modalOptions?.btnAccept || "Đồng ý"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
