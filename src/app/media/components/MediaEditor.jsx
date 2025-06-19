"use client";
import React, { useEffect, useRef, useState } from "react";
import "tui-image-editor/dist/tui-image-editor.min.css";
import "../assets/custom-editor.scss"
import { checkHistoryFile, handleUpdateImage } from "./actions";
import { useMediaStore } from "@/stories/files/mediaStore";

const MediaEditor = () => {
  const editorRef = useRef(null);
  const [imageOld, setImageOld] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorImage = useMediaStore((state) => state.editorImage);
  const setEditorImage = useMediaStore((state) => state.setEditorImage);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!editorImage) return;
    
    setIsLoading(true);
    const ImageEditor = require("tui-image-editor");
    
    instanceRef.current = new ImageEditor(editorRef.current, {
      includeUI: {
        loadImage: {
          path: editorImage.url,
          name: editorImage.filename,
        },
        initMenu: "filter", // Bắt đầu với menu filter
        menuBarPosition: "bottom",
        // Cấu hình đầy đủ các menu
        menu: ["crop", "flip", "rotate", "draw", "shape", "icon", "text", "mask", "filter"],
        uiSize: {
          width: "100%",
          height: "100%"
        }
      },
    });

   

    // Event listeners để cải thiện UX
    instanceRef.current.on("objectActivated", () => {
      console.log("Object activated");
    });

    instanceRef.current.on("objectAdded", () => {
      console.log("Object added");
    });

    getImageOld();
    setIsLoading(false);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorImage]);

  useEffect(() => {
    if (!editorImage) {
      setImageOld(null);
    }
  }, [editorImage]);

  const getImageOld = async () => {
    try {
      const { data, status } = await checkHistoryFile(editorImage._id);
      if (status === 200) {
        setImageOld(data);
      }
    } catch (error) {
      console.error("Error getting image history:", error);
    }
  };

  const handleEditMedia = async () => {
    try {
      setIsLoading(true);
      const img = instanceRef.current.toDataURL({
        format: "image/png",
        quality: 0.9
      });
      
      const newImage = await handleUpdateImage({
        _id: editorImage._id,
        img: img,
      });
      
      // Update the image reference
      if (editorImage.imageRef?.current) {
        editorImage.imageRef.current.src = editorImage.url;
      }
      
      setEditorImage(null);
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Có lỗi xảy ra khi lưu ảnh. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (
      confirm(
        "Bạn có chắc chắn muốn khôi phục về ảnh gốc? Tất cả thay đổi hiện tại sẽ bị mất!"
      )
    ) {
      try {
        setIsLoading(true);
        instanceRef.current.loadImageFromURL(
          process.env.NEXT_PUBLIC_ENDPOINT_URL + imageOld.url,
          "RestoreImage"
        );
        setImageOld(null);
      } catch (error) {
        console.error("Error restoring image:", error);
        alert("Có lỗi xảy ra khi khôi phục ảnh!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (instanceRef.current) {
      const dataUrl = instanceRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = `edited_${editorImage.filename}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    if (confirm("Bạn có chắc muốn reset tất cả thay đổi?")) {
      instanceRef.current.clearUndoStack();
      instanceRef.current.loadImageFromURL(editorImage.url, editorImage.filename);
    }
  };

  return (
    <>
      {editorImage && (
        <div className="fixed inset-0 z-[200] bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl">
          <div className="absolute inset-0">
            <div className="p-6 h-full">
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-4 px-6 flex justify-between items-center rounded-t-2xl shadow-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
                    <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
                  </div>
                  <span className="text-white font-semibold text-lg ml-4 drop-shadow-sm">
                    ✨ {editorImage.filename}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Action buttons */}
                  <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Tải về</span>
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="font-medium">Reset</span>
                  </button>
                  
                  {imageOld && (
                    <button
                      onClick={handleRestore}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="font-medium">Khôi phục</span>
                    </button>
                  )}
                  
                  <button
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-6 py-2.5 text-white rounded-xl transition-all duration-300 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={handleEditMedia}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang lưu...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>💾 Lưu ảnh</span>
                      </div>
                    )}
                  </button>
                  
                  <button
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 p-3 rounded-xl text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => setEditorImage(null)}
                    disabled={isLoading}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Editor Container */}
              <div
                ref={editorRef}
                className="h-[calc(100vh-140px)]"
                style={{
                  filter: isLoading ? "blur(2px)" : "none",
                  transition: "filter 0.3s ease"
                }}
              ></div>
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl flex items-center space-x-4 shadow-2xl border border-white/20">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-800 font-semibold text-lg">Đang xử lý...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaEditor;