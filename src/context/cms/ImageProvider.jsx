"use client";
import MediaProvider from "@/app/media/MediaProvider";
import MediaMain from "@/app/media/MediaMain";
import { useEffect, useRef } from "react";
import { useImageStore } from "@/stories/files/imageStore";

const ImageProvider = ({ children }) => {
  const imageRef = useRef(null);
  
  const showMedia = useImageStore((state) => state.showMedia);
  const choosed = useImageStore((state) => state.choosed);
  const listImageChoosed = useImageStore((state) => state.listImageChoosed);
  const setShowMedia = useImageStore((state) => state.setShowMedia);
  const setIsMultiple = useImageStore((state) => state.setIsMultiple);
  const setChoosed = useImageStore((state) => state.setChoosed);
  const updateFileCurrent = useImageStore((state) => state.updateFileCurrent);
  const updateFileCurrentItems = useImageStore((state) => state.updateFileCurrentItems);
  
  const handleOffClick = (e) => {
    if (e.target.contains(imageRef.current)) {
      setShowMedia(false);
      setIsMultiple(false);
    }
  };

  useEffect(() => {
    if (choosed) {
      updateFileCurrent(showMedia, choosed);
      setChoosed(null);
    }
  }, [choosed, showMedia, updateFileCurrent, setChoosed]);

  useEffect(() => {
    if (listImageChoosed.length > 0) {
      updateFileCurrentItems(showMedia, listImageChoosed);
    }
  }, [listImageChoosed, showMedia, updateFileCurrentItems]);

  useEffect(() => {
    if (showMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showMedia]);

  return (
    <>
      {children}
      {showMedia && (
        <div
          className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,.2)] z-[9999]"
          onClick={handleOffClick}
        >
          <div className="max-w-[90vw] mx-auto" ref={imageRef}>
            <div className="py-4 px-4 shadow-md rounded-lg bg-white h-[calc(100vh-80px)] mt-10 relative overflow-auto">
              <MediaProvider>
                <MediaMain />
              </MediaProvider>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageProvider;