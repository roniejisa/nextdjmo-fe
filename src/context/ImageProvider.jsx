"use client";
import MediaProvider from "@/app/media/MediaProvider";
import MediaComponent from "@/components/Media/MediaComponent";
import { createContext, useEffect, useRef, useState } from "react";

export const GalleryContext = createContext(null);
const ImageProvider = ({ children }) => {
  const [showMedia, setShowMedia] = useState(false);
  const [dataImage, setDataImage] = useState(null);
  const [isMultiple, setIsMultiple] = useState(false);
  const imageRef = useRef(null);
  const [choosed, setChoosed] = useState(null);
  const [listImageChoosed, setListImageChoosed] = useState([]);
  const [itemCurrent, setItemCurrent] = useState([]);
  const [listImage, setListImage] = useState([]);
  const handleOffClick = (e) => {
    if (e.target.contains(imageRef.current)) {
      setShowMedia(false);
      setIsMultiple(false);
    }
  };

  useEffect(() => {
    if (choosed) {
      setItemCurrent((prev) => {
        const index = prev.findIndex((item) => item.id == showMedia);
        if (index !== -1) {
          prev[index].data = choosed;
        } else {
          prev.push({ id: showMedia, data: choosed });
        }
        return prev;
      });
      setChoosed(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosed]);

  useEffect(() => {
    if (listImageChoosed.length > 0) {
      setItemCurrent((prev) => {
        const index = prev.findIndex((item) => item.id == showMedia);
        if (index !== -1) {
          prev[index].items = [
            ...prev[index].items,
            ...listImageChoosed.filter(
              (newItem) =>
                !prev[index].items.some(
                  (existingItem) => existingItem._id === newItem._id
                )
            ),
          ];
        } else {
          return [...prev, { id: showMedia, items: listImageChoosed }];
        }
        return [...prev];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listImageChoosed]);

  useEffect(() => {
    if (showMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showMedia]);
  return (
    <GalleryContext.Provider
      value={{
        listImageChoosed,
        setListImageChoosed,
        showMedia,
        setShowMedia,
        dataImage,
        setDataImage,
        choosed,
        setChoosed,
        itemCurrent,
        setItemCurrent,
        listImage,
        setListImage,
        isMultiple,
        setIsMultiple,
      }}
    >
      {children}
      {showMedia && (
        <div
          className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,.2)] z-10"
          onClick={handleOffClick}
        >
          <div className="max-w-[90vw] mx-auto" ref={imageRef}>
            <div className="bg-white py-4 px-4 shadow-md rounded-lg h-[calc(100vh-80px)] mt-10 relative">
              <MediaProvider>
                <MediaComponent />
              </MediaProvider>
            </div>
          </div>
        </div>
      )}
    </GalleryContext.Provider>
  );
};

export default ImageProvider;
