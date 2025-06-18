import Image from "next/image";
import React from "react";
import { mediaOptions } from "./default";
import File from "@/components/Icon/svg/File";
import { useMediaStore } from "@/stories/files/mediaStore";
import { useCallbackMenu } from "@/hooks/files/useCallbackMenu";
import { useNotify } from "@/context/NotifyProvider";

const DefaultType = ({ media }) => {
  const { filename, url, file_info, extension, _id } = media;
  let fileInfo = file_info;
  if (typeof file_info === "string") {
    fileInfo = JSON.parse(file_info.replaceAll("'", '"')) ?? {};
  }
  const { size } = fileInfo;

  const { setMenuPosition, setListComponent } = useMediaStore((state) => state);
  const notify = useNotify();
  const callbackMenu = useCallbackMenu(notify);
  const handleShowContextMenu = (e) => {
    e.preventDefault();

    setMenuPosition(null);
    const { clientX, clientY } = e.nativeEvent;
    setTimeout(() => {
      setMenuPosition({ x: clientX, y: clientY });
      setListComponent([...mediaOptions(_id, callbackMenu)]);
    }, 200);
  };

  return (
    <div
      className="inset-0 absolute rounded-2xl overflow-hidden h-full
      bg-gradient-to-br from-slate-100/60 via-gray-50/40 to-slate-200/60
      backdrop-blur-sm
      border border-white/30
      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.08)]
      group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.12)]
      transition-all duration-300"
      onContextMenu={handleShowContextMenu}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <File
          className="w-12 h-12 text-slate-600/70 drop-shadow-sm 
          group-hover:text-slate-700/80 group-hover:scale-110 transition-all duration-200"
        />
      </div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none"></div>
    </div>
  );
};

export default DefaultType;
