"use client";

import MediaList from "@/app/media/MediaList";
import MediaProvider from "@/app/media/MediaProvider";
import { GalleryContext } from "@/context/ImageProvider";
import { useContext, useEffect, useState, useTransition } from "react";
import { getToken } from "./action";
import Editor from "@/app/media/components/Editor";
import MenuContext from "@/app/media/components/MenuContext";
import UploadForm from "@/app/media/UploadForm";

const MediaComponent = () => {
  // const { setShowMedia } = useContext(GalleryContext);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [token, setToken] = useState(null);
  const { listImage,setListImageChoosed } = useContext(GalleryContext);
  const getTokenFromClient = async () => {
    const token = await getToken();
    startTransition(async function () {
      setToken(token);
      setDone(true);
    });
  };
  useEffect(() => {
    getTokenFromClient();
  }, []);
  return (
    <MediaProvider>
      <div className="flex justify-between">
        <h1 className="text-3xl mb-4 font-bold">Media</h1>
        {listImage.length > 0 ? <button onClick={() => {
          setListImageChoosed(listImage);
        }}>Chọn</button> : ""}
      </div>
      <UploadForm />
      {done && !isPending && <MediaList token={token} />}
      <MenuContext />
      <Editor />
    </MediaProvider>
  );
};

export default MediaComponent;
