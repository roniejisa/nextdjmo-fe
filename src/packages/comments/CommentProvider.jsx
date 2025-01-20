"use client";

import {
  createContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import StarInput from "./StarInput";
import { submitReview } from "./action";
import { usePathname } from "next/navigation";
import useRouterCustom from "../translation/Navigation";
import { useNotify } from "@/context/NotifyProvider";

export const CommentContext = createContext();
const CommentProvider = ({ children, type, id }) => {
  const [showModel, setShowModel] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [reset, setReset] = useState(false);
  const modelRef = useRef(null);
  const pathname = usePathname();
  const router = useRouterCustom();
  const notify = useNotify();
  const formRef = useRef(null);
  const handleShowModel = (e) => {
    if (e.target.contains(modelRef.current)) {
      setShowModel(!showModel);
    }
  };

  const handleSubmitFormReview = async (form) => {
    startTransition(async () => {
      const body = Object.fromEntries(form);
      (body.type = type), (body.id = id);
      const response = await submitReview(body);
      if (response.status == 401) {
        notify.changeNotify("error", response.message);
        return router.push("/dang-nhap?redirect=" + pathname);
      } else if (response.status == 200) {
        formRef.current.reset();
        notify.changeNotify("success", response.message);
        setShowModel(false);
        setReset(true);
      } else {
        notify.changeNotify("error", response.message);
      }
    });
  };

  return (
    <CommentContext.Provider value={{ showModel, setShowModel, type, id }}>
      {children}
      <div
        ref={modelRef}
        onClick={handleShowModel}
        className={`fixed top-0 left-0 bg-[rgba(0,0,0,.5)] flex justify-center items-center cursor-pointer w-full h-full z-[9999] ${
          showModel
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <div className="bg-white rounded-md shadow-md w-full max-w-[600px]">
          <form className="p-4" action={handleSubmitFormReview} ref={formRef}>
            <div className="flex justify-center">
              <StarInput reset={reset} size="48" setReset={setReset} />
            </div>
            <div className="mt-4">
              <textarea
                className="p-2 w-full border rounded-md outline-none"
                name="content"
                placeholder="Nhập bình luận"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md border"
                onClick={() => setShowModel(false)}
              >
                Đóng
              </button>
              <button className="px-4 py-2 rounded-md border border-active-dark bg-active-dark text-white">
                Bình luận
              </button>
            </div>
          </form>
        </div>
      </div>
    </CommentContext.Provider>
  );
};

export default CommentProvider;
