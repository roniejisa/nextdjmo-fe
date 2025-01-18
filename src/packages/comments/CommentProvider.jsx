"use client";

import { createContext, useEffect, useRef, useState } from "react";

export const CommentContext = createContext();
const CommentProvider = ({ children }) => {
  const [showModel, setShowModel] = useState(false);
  const modelRef = useRef(null);

  const handleShowModel = (e) => {
    if (e.target.contains(modelRef.current)) {
      setShowModel(!showModel);
    }
  };
  return (
    <CommentContext.Provider value={{ showModel, setShowModel }}>
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
            <form className="p-4">
                <div className="">
                    <textarea className="px-4 py-2 w-full border rounded-md" name="content" placeholder="Nhập bình luận"></textarea>
                </div>
                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded-md border" onClick={() => setShowModel(false)}>Đóng</button>
                    <button className="px-4 py-2 rounded-md border border-active-dark bg-active-dark text-white">Bình luận</button>
                </div>
            </form>
        </div>
      </div>
    </CommentContext.Provider>
  );
};

export default CommentProvider;
