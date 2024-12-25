"use client";
import { createContext, useContext, useRef, useState } from "react";

export const MediaContext = createContext(null);
const MediaProvider = ({ children }) => {
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
  return (
    <MediaContext.Provider
      value={{
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
