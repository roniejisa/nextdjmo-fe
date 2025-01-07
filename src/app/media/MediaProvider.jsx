"use client";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { createContext, useContext, useRef, useState } from "react";

export const MediaContext = createContext(null);
const MediaProvider = ({ children }) => {
  const notify = useNotify();
  const router = useRouterCustom();
  const [folders, setFolders] = useState([]);
  const [medias, setMedias] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [listComponent, setListComponent] = useState([]);

  // SELECT
  const mediaItemRef = useRef(null);
  const canvasRef = useRef(null);
  const divCloneCanvasRef = useRef(null);
  const selectingRef = useRef(false);
  const itemsRef = useRef(null);
  const itemsSelectingRef = useRef([]);
  const positionTransformRef = useRef(undefined);
  const ctxRef = useRef(null);
  const pageXRef = useRef(0);
  const pageYRef = useRef(0);
  const movePageX = useRef(0);
  const movePageY = useRef(0);

  const callbackMenu = (type, response, _id) => {
    switch (type) {
      case "delete-file":
        setMedias(medias.filter((media) => media._id !== _id));
        break;
      case "delete-folder":
        setFolders(folders.filter((folder) => folder._id !== _id));
        break;
    }
    if (response.status && response.message) {
      notify.changeNotify(
        response.status == 200 ? "success" : "error",
        response.message
      );
    }
    
    if (response.status == 200) {
      router.refresh();
    }
  };
  return (
    <MediaContext.Provider
      value={{
        folders,
        setFolders,
        medias,
        setMedias,
        showUpload,
        setShowUpload,
        showCreateFolder,
        setShowCreateFolder,
        editorImage,
        setEditorImage,
        menuPosition,
        setMenuPosition,
        listComponent,
        setListComponent,
        mediaItemRef,
        canvasRef,
        divCloneCanvasRef,
        itemsRef,
        selectingRef,
        itemsSelectingRef,
        positionTransformRef,
        ctxRef,
        pageXRef,
        pageYRef,
        movePageX,
        movePageY,
        callbackMenu,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaProvider;

export const useMedia = (callback) => {
  const context = useContext(MediaContext);
  return callback(context);
};
