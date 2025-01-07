"use client";

import MediaList from "@/app/media/MediaList";
import { GalleryContext } from "@/context/ImageProvider";
import { useContext, useEffect, useState, useTransition } from "react";
import { getToken } from "./action";
import Editor from "@/app/media/components/Editor";
import MenuContext from "@/app/media/components/MenuContext";
import UploadForm from "@/app/media/UploadForm";
import CreateFolder from "@/app/media/CreateFolder";
import Breadcrumb from "./Breadcrumb";

const MediaComponent = () => {
  // const { setShowMedia } = useContext(GalleryContext);
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState(null);
  const { listImage, setListImageChoosed } = useContext(GalleryContext);
  const getTokenFromClient = async () => {
    const token = await getToken();
    startTransition(async function () {
      setToken(token);
    });
  };
  useEffect(() => {
    getTokenFromClient();
  }, []);

  return (
    <>
      {token && (
        <div>
          <div className="flex justify-between items-center p-4">
            <Breadcrumb />
            <div className="flex justify-end">
              <CreateFolder />
              <UploadForm token={token} />
              {listImage.length > 0 ? (
                <button
                  className="bg-green-400 ml-4 py-2 px-4 rounded-lg text-white"
                  onClick={() => {
                    setListImageChoosed(listImage);
                  }}
                >
                  Chọn
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          {!isPending && <MediaList token={token} />}
        </div>
      )}
      <MenuContext />
      <Editor />
    </>
  );
};

export default MediaComponent;
