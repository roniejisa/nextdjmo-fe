"use client";

import { ClientContext } from "@/context/ClientProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { useContext, useRef } from "react";

const ModalSeach = () => {
  const { showModalSearch, setShowModalSearch } = useContext(ClientContext);
  const router = useRouterCustom()
  const modalRef = useRef(null);
  const handleSubmit = async (form) => {
    const body = Object.fromEntries(form);
    const url = new URLSearchParams(body).toString();
    router.push(`/?${url}`)
    router.refresh();
    setShowModalSearch(false);
  };

  const hiddenModal = (e) => {
    if (e.target.contains(modalRef.current)) {
      setShowModalSearch(false);
    }
  };
  return (
    <>
      {showModalSearch && (
        <div
          className={`fixed bg-[#00000080] transition-all duration-300 top-0 left-0 w-full h-screen z-[9999] ${
            showModalSearch ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          ref={modalRef}
          onClick={hiddenModal}
        >
          <form
            action={handleSubmit}
            className={`flex transition-all duration-300 px-4 border rounded-lg justify-center absolute w-10/12 ml-[calc((100%-100%/12*10)/2)] lg:w-[calc(100%-80px*2)] py-10 items-center ${
              showModalSearch
                ? "delay-500 opacity-100 visible top-10"
                : "opacity-0 invisible"
            } bg-white lg:mx-20`}
          >
            <div className="flex items-center w-full border-b py-2">
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
                className="w-4 h-4 mr-2"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm"
                name="q"
                className="outline-0 outline-transparent w-full flex-1"
              />
              <button className="px-4 py-2 rounded-3xl bg-gray-200 hover:bg-blue-800 hover:text-white transition-all duration-300">
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ModalSeach;
