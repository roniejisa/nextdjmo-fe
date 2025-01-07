"use client";
import { useNotify } from "@/context/NotifyProvider";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const MediaContext = createContext(null);
const MediaProvider = ({ children }) => {
  const notify = useNotify();
  const [folders, setFolders] = useState([]);
  const [medias, setMedias] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [listComponent, setListComponent] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [page, setPage] = useState(1);
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
  const loadedPages = useRef(new Set());

  const callbackMenu = (type, response, _id) => {
    switch (type) {
      case "delete-file":
        if (response.status == 200)
          setMedias(medias.filter((media) => media._id !== _id));
        break;
      case "delete-folder":
        if (response.status == 200)
          setFolders(folders.filter((folder) => folder._id !== _id));
        break;
    }
    if (response.status && response.message) {
      notify.changeNotify(
        response.status == 200 ? "success" : "error",
        response.message
      );
    }
  };

  useEffect(() => {
    setMedias([]);
    setFolders([]);
    setPage(1);
  }, [breadcrumbs]);
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
        breadcrumbs,
        setBreadcrumbs,
        page,
        setPage,
        loadedPages,
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
