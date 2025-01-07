"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMedia } from "../MediaProvider";
import "tui-image-editor/dist/tui-image-editor.min.css";
import { checkHistoryFile, handleUpdateImage } from "./actions";
const myTheme = {
  "header.display": "none",
};
const Editor = () => {
  const editorRef = useRef(null);
  const [imageOld, setImageOld] = useState(null);
  const editorImage = useMedia(({ editorImage }) => editorImage);
  const setEditorImage = useMedia(({ setEditorImage }) => setEditorImage);
  const instanceRef = useRef(null);
  useEffect(() => {
    if (!editorImage) return;
    const ImageEditor = require("tui-image-editor");
    instanceRef.current = new ImageEditor(editorRef.current, {
      includeUI: {
        loadImage: {
          path: editorImage.url,
          name: editorImage.filename,
        },
        theme: myTheme,
        initMenu: "filter",
        menuBarPosition: "bottom",
      },
      cssMaxWidth: 700,
      cssMaxHeight: 300,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
      },
    });
    getImageOld();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorImage]);

  useEffect(() => {
    if (!editorImage) {
      setImageOld(null);
    }
  }, [editorImage]);
  const getImageOld = async () => {
    const { data, status } = await checkHistoryFile(editorImage._id);

    if (status == 200) {
      setImageOld(data);
    }
  };

  const handleEditMedia = async () => {
    const img = instanceRef.current.toDataURL();
    const newImage = await handleUpdateImage({
      _id: editorImage._id,
      img: img,
    });
    // Chỗ này cần thay cái ảnh vừa được chọn thực ra là url như cũ
    editorImage.imageRef.current.src = editorImage.url;
    setEditorImage(null);
  };

  const handleRestore = async () => {
    if (
      confirm(
        "Sau khi bạn ấn nút này sẽ khôi phục ngay về ảnh ban đầu bạn chắc chắn chứ!"
      )
    ) {
      instanceRef.current.loadImageFromURL(
        process.env.NEXT_PUBLIC_ENDPOINT_URL + imageOld.url,
        "SampleImage"
      );
      setImageOld(null)
    }
  };
  return (
    <>
      {editorImage && (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[9999]">
          <div className="absolute w-full h-full top-0 left-0">
            <div className="p-10 h-full bg-[#00000030]">
              <div className="bg-[#151515] py-2 flex justify-end px-4">
                {imageOld && (
                  <button
                    onClick={handleRestore}
                    className="bg-blue-400 text-white mr-2 p-2 rounded-md"
                  >
                    Khôi phục ảnh gốc
                  </button>
                )}
                <button
                  className="bg-orange-500 p-2 text-white rounded-md mr-2"
                  onClick={handleEditMedia}
                >
                  Sửa ảnh
                </button>
                <button
                  className="bg-red-600 p-2 rounded-md text-white"
                  onClick={() => setEditorImage(null)}
                >
                  Đóng
                </button>
              </div>
              <div ref={editorRef} className="h-[calc(100vh-56px-40px*2)]"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Editor;
