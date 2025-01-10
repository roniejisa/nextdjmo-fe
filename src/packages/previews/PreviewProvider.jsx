"use client";
import { createContext, useRef, useState } from "react";
import PreviewControl from "./PreviewControl";

export const PreviewContext = createContext();
const PreviewProvider = ({ data, children, type = "follow" }) => {
  const [previewIndex, setPreviewIndex] = useState(null);
  const [images, setImages] = useState(data);
  return (
    <PreviewContext.Provider
      value={{
        previewIndex,
        setPreviewIndex,
        images,
        setImages,
        type,
      }}
    >
      {children}
      <PreviewControl />
    </PreviewContext.Provider>
  );
};

export default PreviewProvider;
