"use client";

import MediaList from "@/app/media/components/MediaList";
import MediaEditor from "@/app/media/components/MediaEditor";
import MenuContext from "@/app/media/components/MenuContext";
import MenuMedia from "./components/MenuMedia";
import "./assets/media.scss"

const MediaMain = () => {
  return (
    <>
      <MenuMedia />
      <MediaList />
      <MenuContext />
      <MediaEditor />
    </>
  );
};

export default MediaMain;
