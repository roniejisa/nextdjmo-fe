"use client";

import {
  CHUNK_SIZE,
  convertSize,
  uploadFileResumable,
} from "@/utils/client/util";
import { useContext, useRef, useState, useTransition } from "react";
import { MediaContext, useMedia } from "./MediaProvider";
import { useNotify } from "@/context/NotifyProvider";
import ImageUpload from "@/components/Icon/svg/ImageUpload";
import CloseIcon from "@/components/Icon/svg/Close";
import ImageCustom from "@/components/Maintain/Image";

const UploadForm = ({ media_id, token }) => {
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const countChunkCurrentRef = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const setMedias = useMedia(({ setMedias }) => setMedias);
  const { breadcrumbs } = useContext(MediaContext);
  const [files, setFiles] = useState([]);
  const fileListRef = useRef(new DataTransfer());
  const notify = useNotify();
  const modalRef = useRef(null);
  const handleUploadFile = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      if (fileListRef.current.files.length > 0) {
        setUploading(true);
      } else {
        notify.changeNotify("error", "Vui lòng chọn file");
        return;
      }

      let totalChunks = 0;
      for (const file of fileListRef.current.files) {
        totalChunks += Math.ceil(file.size / CHUNK_SIZE);
      }

      for await (const file of fileListRef.current.files) {
        const obj = {
          file_id: Math.random().toString(36).slice(-10),
        };
        if (breadcrumbs.length > 0) {
          obj.media_id = breadcrumbs[breadcrumbs.length - 1]._id;
        }
        // random media_id str and text 10 ký tự
        const response = await uploadFileResumable(
          file,
          obj,
          () => {
            countChunkCurrentRef.current += 1;
            const percentage = Math.round(
              (countChunkCurrentRef.current / totalChunks) * 100
            );
            setProgress(percentage);
          }, // Cập nhật tiến độ upload
          (media) => {
            if (media && media.message && typeof media.message == "string")
              return;
            setMedias((medias) => [media, ...medias]);
          },
          token
        );
        if (response.status) {
          notify.changeNotify("error", response.message);
          return false;
        }
      }
      fileListRef.current = new DataTransfer();
      setTimeout(() => {
        notify.changeNotify("success", "Tải lên thành công");
        countChunkCurrentRef.current = 0;
        setShowModal(false);
        setUploading(false);
        setProgress(0);
        setFiles([]);
      }, 200);
    });
  };

  const handleChangeFile = (e) => {
    for (const file of e.target.files) {
      fileListRef.current.items.add(file);
    }
    e.target.value = null;
    showFileData();
  };

  const showFileData = () => {
    setFiles(
      [...fileListRef.current.files].map((file) => {
        const obj = {
          name: file.name,
          size: convertSize(file.size),
        };
        if (file.type.startsWith("image")) {
          obj.url = URL.createObjectURL(file);
        } else {
          obj.icon = (
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.71 4.29l-3-3L10 1H4L3 2v12l1 1h9l1-1V5l-.29-.71zM13 14H4V2h5v4h4v8zm-3-9V2l3 3h-3z"
              ></path>
            </svg>
          );
        }
        return obj;
      })
    );
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      for (const file of e.dataTransfer.files) {
        fileListRef.current.items.add(file);
      }
    }
    showFileData();
  };

  const handleRemoveFile = (index) => {
    fileListRef.current.items.remove(index);
    showFileData();
  };

  const handleCloseModal = (e) => {
    if (e.target.contains(modalRef.current)) {
      setShowModal(false);
    }
  };
  return (
    <>
      <button
        className="bg-outline py-2 px-4 rounded-lg text-white"
        onClick={() => setShowModal(true)}
      >
        Upload
      </button>
      {showModal && (
        <div className="fixed top-0 left-0 w-full  z-[9999] h-full">
          <div
            ref={modalRef}
            className="absolute top-0 left-0 w-full h-full cursor-pointer bg-[#00000050]"
            onClick={handleCloseModal}
            style={{ backdropFilter: "blur(12px)" }}
          ></div>
          <div className="p-4 max-w-[500px] z-[1000] w-full bg-white rounded-lg overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between pb-10 font-bold text-xl">
              <h3>Tải tệp tin</h3>
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center"
                onClick={() => setShowModal(false)}
              >
                <CloseIcon className={`h-4 w-4 text-gray-500`} />
              </button>
            </div>
            <div className="w-full absolute top-0 left-0 h-1">
              <div
                className="bg-gradient-to-r from-blue-300 to-purple-400 text-2xl h-full"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>
            <form
              onSubmit={handleUploadFile}
              className={isPending || uploading ? "pointer-events-none" : ""}
            >
              <label onDragOver={handleDragOver} onDrop={handleDrop}>
                <div className="flex items-center gap-2 flex-col justify-center transition-all duration-300 rounded-md border-2 border-dashed hover:border-outline py-2">
                  <ImageUpload />
                  <p className="my-5">
                    Ấn để thêm hoặc kéo thả{" "}
                    <span className="text-outline">tệp tin</span> vào
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  name="files"
                  hidden
                  onChange={handleChangeFile}
                />
              </label>
              <div className="max-h-[150px] overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="p-2 mt-2 bg-gray-50 rounded-md">
                    <div className="flex flex-wrap items-center gap-2 py-2">
                      <div className="flex-[0_0_60px] flex items-center">
                        {file.icon && (
                          <svg
                            className="w-[50px] h-[50px]"
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 16 16"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13.71 4.29l-3-3L10 1H4L3 2v12l1 1h9l1-1V5l-.29-.71zM13 14H4V2h5v4h4v8zm-3-9V2l3 3h-3z"
                            ></path>
                          </svg>
                        )}
                        {file.url && (
                          <ImageCustom
                            src={file.url}
                            width={50}
                            height={50}
                            alt={file.name}
                          />
                        )}
                      </div>
                      <div className="flex-[0_0_calc(100%-60px-50px)]">
                        <p className="line-clamp-1 break-all">{file.name}</p>
                        <span>{file.size}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {media_id && (
                <input
                  name="media_id"
                  defaultValue={media_id}
                  readOnly
                  hidden
                />
              )}
              <button
                className="bg-outline mt-4 py-2 px-4 rounded-lg text-white w-full [&[disabled]]:cursor-not-allowed [&[disabled]]:opacity-50 [&[disabled]]:pointer-events-none"
                disabled={isPending || uploading}
              >
                Tải lên
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadForm;
