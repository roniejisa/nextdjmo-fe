"use client";

import CloseIcon from "@/components/Icon/svg/Close";
import { useContext, useRef, useState } from "react";
import { postCreateFolder } from "./action";
import { MediaContext } from "./MediaProvider";
import { useNotify } from "@/context/NotifyProvider";

const CreateFolder = () => {
  const [folder, setFolder] = useState("");
  const { folders, setFolders, breadcrumbs } = useContext(MediaContext);
  const [showModal, setShowModal] = useState(false);
  const notify = useNotify();
  const modalRef = useRef(null);
  const handleCreateFolder = async (form) => {
    const body = Object.fromEntries(form);
    if (breadcrumbs.length > 0)
      body.media_id = breadcrumbs[breadcrumbs.length - 1]._id;
    const data = await postCreateFolder(body);
    if (data.status == 200) {
      setFolders([...folders, data.data]);
      notify.changeNotify("success", data.message);
      setShowModal(false);
    }
  };
  return (
    <>
      <button
        className="bg-yellow-400 ml-4 py-2 px-4 rounded-lg mr-4"
        onClick={() => setShowModal(true)}
      >
        Tạo folder
      </button>
      {showModal && (
        <div
          ref={modalRef}
          className="fixed z-[9999] w-full h-full inset-0 overflow-y-auto"
        >
          <div
            className="absolute w-full h-full bg-[rgba(0,0,0,.2)]"
            onClick={() => setShowModal(false)}
            style={{
              backdropFilter: "blur(12px)",
            }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-md">
            <div>
              <h3 className="font-bold text-xl mb-4">Tạo folder</h3>
              <button
                className="absolute top-4 right-4 rounded-full p-2 bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <form action={handleCreateFolder} className="flex">
              <input
                type="text"
                value={folder}
                name="name"
                placeholder="Nhập tên folder"
                onChange={(e) => setFolder(e.target.value)}
                className="w-full outline-outline outline-4 transition border rounded-md p-2"
              />
              <button className="bg-outline ml-2 py-2 px-4 rounded-lg text-white">
                Tạo
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateFolder;
