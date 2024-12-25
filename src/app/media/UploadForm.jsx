"use client";

import { uploadFileResumable } from "@/utils/client/util";
import { useState } from "react";
import { useMedia } from "./MediaProvider";

const UploadForm = ({ media_id }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const setMedias = useMedia(({ setMedias }) => setMedias);
  const handleUploadFile = async (e) => {
    e.preventDefault();
    e.target.files.length > 0 && setUploading(true);
    const formData = new FormData(e.target);

    for await (const file of formData.getAll("files")) {
      // random media_id str and text 10 ký tự
      const file_id = Math.random().toString(36).slice(-10);
      const response = await uploadFileResumable(
        file,
        file_id,
        (percent) => setProgress(percent), // Cập nhật tiến độ upload
        (media) => {
          if(media && media.message && typeof media.message == 'string') return
          setMedias((medias) => [media, ...medias])
        }
      );
    }
    setUploading(false);
    setProgress(0);
  };
  return (
    <>
      {
        <div className="w-full absolute top-0 left-0 h-1">
          <div
            className="bg-gradient-to-r from-blue-300 to-purple-400 text-2xl h-full"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      }
      <form onSubmit={handleUploadFile}>
        <input type="file" multiple name="files" />
        {media_id && (
          <input name="media_id" defaultValue={media_id} readOnly hidden />
        )}
        <button>Tải lên</button>
      </form>
    </>
  );
};

export default UploadForm;
