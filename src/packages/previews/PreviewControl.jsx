"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { PreviewContext } from "./PreviewProvider";
import { showImageUrl } from "@/utils/client/util";
import MouseEffect from "@/components/Mouse/MouseEffect";

const PreviewControl = () => {
  const { previewIndex, setPreviewIndex, images, type } =
    useContext(PreviewContext);
  const imageRef = useRef(null);
  const [fadeIn, setFadeIn] = useState(false); // State để quản lý hiệu ứng fade

  useEffect(() => {
    if (previewIndex != null) {
      setFadeIn(false);

      // Bắt đầu hiệu ứng fade

      // Reset lại hiệu ứng fade sau một khoảng thời gian (500ms để match với thời gian transition)
      const timer = setTimeout(() => {
        const url = showImageUrl(images[previewIndex]);
        imageRef.current.style.backgroundImage = `url(${url})`;
        setFadeIn(true);
      }, 300);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewIndex]);

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      // Hiệu ứng hướng về chuột
      const x = e.clientX - rect.left; // Tọa độ chuột trong khung hình
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2; // Tâm ngang của ảnh
      const centerY = rect.height / 2; // Tâm dọc của ảnh
      let rotateX = 0;
      let rotateY = 0;
      if (type === "follow") {
        // Tính toán góc xoay theo trục X và Y
        rotateX = ((y - centerY) / centerY) * 15; // Góc nghiêng theo trục X
        rotateY = ((x - centerX) / centerX) * -15; // Góc nghiêng theo trục Y
      } else {
        rotateX = ((y - centerY) / centerY) * -15;
        rotateY = ((x - centerX) / centerX) * 15;
      }

      imageRef.current.style.transform = `scale(1.1) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      imageRef.current.style.transition = "opacity";
    }
  };

  const handleMouseLeave = (e) => {
    if (previewIndex != null) {
      imageRef.current.style.transform =
        "scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)";
      imageRef.current.style.transition = "transform 500ms, opacity 500ms";
    }
  };

  const handleNext = () => {
    if (previewIndex != null) {
      const nextIndex = (previewIndex + 1) % images.length;
      setPreviewIndex(nextIndex);
    }
  };
  const handlePrev = () => {
    if (previewIndex != null) {
      const prevIndex = (previewIndex - 1 + images.length) % images.length;
      setPreviewIndex(prevIndex);
    }
  };

  const handleClose = () => {
    imageRef.current.style.transform =
      "scale(0) perspective(1000px) rotateX(0deg) rotateY(0deg)";
    imageRef.current.style.transition = "transform 500ms, opacity 500ms";
    setPreviewIndex(null);
    setTimeout(() => {
      imageRef.current.style = "";
    }, 500);
  };
  return (
    <>
      <section
        className={`fixed bg-[rgba(0,0,0,.8)] z-[9999] duration-300 top-0 left-0 w-full h-screen flex items-center justify-center px-4 py-2 ${
          previewIndex != null
            ? "visible opacity-100 pointer-events-auto"
            : "invisible opacity-0 pointer-events-none delay-[550ms]"
        }`}
      >
        <div className="h-[calc(100vh-20%)] w-[500px] px-4">
          <div
            className={`max-w-full h-full bg-center bg-no-repeat bg-contain transition-opacity duration-300 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          ></div>
        </div>
        <button
          className="text-white absolute top-1/2 -translate-y-1/2 right-4 cursor-none"
          onClick={handleNext}
        >
          <svg
            className="w-10 h-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </button>
        <button
          className="text-white absolute top-1/2 -translate-y-1/2 left-4 cursor-none"
          onClick={handlePrev}
        >
          <svg
            className="w-10 h-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 6l-6 6l6 6" />
          </svg>
        </button>
        <button
          className="text-white absolute top-4 right-4 cursor-none"
          onClick={handleClose}
        >
          <svg
            className="w-10 h-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </section>
      <MouseEffect dependencies={{ previewIndex }} />
    </>
  );
};

export default PreviewControl;
