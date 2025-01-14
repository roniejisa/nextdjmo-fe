"use client";
import { useRef } from "react";
import { updateVideo } from "./action";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";

const ButtonUpload = ({ token }) => {
  const percentRef = useRef(0);
  const notify = useNotify();
  const router = useRouterCustom();
  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    const totalChunks = Math.ceil(file.size / (1024 * 1024 * 5));
    const response = await updateVideo(
      file,
      (count) => {
        console.log(count);
        const percentage = Math.round((count / totalChunks) * 100);
        percentRef.current.innerText = `${percentage}%`;
        percentRef.current.style.opacity = "1";
        percentRef.current.style.pointerEvents = "auto";
        percentRef.current.style.visibility = "visible";
      },
      token
    );
    percentRef.current.style.opacity = "0";
    percentRef.current.style.pointerEvents = "none";
    percentRef.current.style.visibility = "hidden";
    notify.changeNotify("success", response.message);
    router.refresh();
  };
  const handleUpdateVideo = () => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "video/*";
    inputFile.click();
    inputFile.onchange = handleChangeFile;
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 text-white bg-[rgba(0,0,0,0.5)] text-6xl w-full h-full flex items-center transition-all duration-300 justify-center"
        ref={percentRef}
        style={{ opacity: 0, pointerEvents: "none", visibility: "hidden" }}
      ></div>
      <button
        onClick={handleUpdateVideo}
        className={"bg-yellow-500 inline-block px-2 py-1 rounded-md mr-2"}
      >
        Thêm video
      </button>
    </>
  );
};

export default ButtonUpload;
