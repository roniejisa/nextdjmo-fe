"use client";

import { useEffect, useRef } from "react";

const MouseEffect = ({ dependencies }) => {
  const { previewIndex } = dependencies;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Thiết lập kích thước canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Hàm vẽ con chuột trên canvas
    // Bán kính của con chuột
    const cursorRadius = 30;

    // Hàm vẽ con chuột trên canvas
    const drawCursor = (x, y, type = "circle") => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas mỗi lần vẽ lại
      //   Vẽ hình tròn
      if (type == "circle") {
        ctx.beginPath();
        ctx.arc(
          x + cursorRadius / 2,
          y + cursorRadius / 2,
          cursorRadius,
          0,
          2 * Math.PI
        ); // Vẽ hình tròn con chuột
        ctx.strokeStyle = "rgba(255, 0, 0, 1)"; // Màu con chuột
        ctx.stroke();
      } else if (type == "square") {
        ctx.beginPath();
        ctx.rect(
          x - cursorRadius / 2,
          y - cursorRadius / 2,
          cursorRadius,
          cursorRadius
        );
        ctx.strokeStyle = "rgba(255, 0, 0, 1)"; // Màu con chuột
        ctx.stroke();
      } else if (type == "heart") {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x - cursorRadius / 2,
          y - cursorRadius / 2,
          x - cursorRadius,
          y + cursorRadius / 2,
          x,
          y + cursorRadius
        );
        ctx.bezierCurveTo(
          x + cursorRadius,
          y + cursorRadius / 2,
          x + cursorRadius / 2,
          y - cursorRadius / 2,
          x,
          y
        );
        ctx.strokeStyle = "rgba(255, 0, 0, 1)"; // Màu con chuót
        ctx.stroke();
      }
    };

    // Hàm xử lý sự kiện di chuyển chuột
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const target = e.target;
      drawCursor(x, y, target.closest("button") ? "heart" : "circle"); // Vẽ con chuột tại vị trí mới
    };

    // Lắng nghe sự kiện di chuyển chuột
    if (canvas && previewIndex != null) {
      document.body.style.cursor = "none";
      document.addEventListener("mousemove", handleMouseMove);
    }

    // Cleanup khi component unmount
    return () => {
      if (canvas && previewIndex != null) {
        document.body.style.cursor = "auto";
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [previewIndex]);
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 z-[9999] left-0 w-full h-full pointer-events-none"
    />
  );
};

export default MouseEffect;
