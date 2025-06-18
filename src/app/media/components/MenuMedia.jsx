import React from "react";
import Breadcrumb from "./Breadcrumb";
import CreateFolder from "./CreateFolder";
import UploadForm from "./UploadForm";
import { useImageStore } from "@/stories/files/imageStore";

const MenuMedia = () => {
  const listFileSelected = useImageStore(state => state.listFileSelected)
  const setListImageChoosed = useImageStore(state => state.setListImageChoosed)
  const isMultiple = useImageStore(state => state.isMultiple)

  return (
    <div className="flex justify-between bg-white items-center p-4 sticky top-0 w-full z-[100]">
      <Breadcrumb />
      <div className="flex justify-end">
        <CreateFolder />
        <UploadForm />
        {listFileSelected.length > 0 && isMultiple ? (
          <button
            className="bg-green-400 ml-4 py-2 px-4 rounded-lg text-white"
            onClick={() => {
              setListImageChoosed(listFileSelected);
            }}
          >
            Chọn
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default MenuMedia;
