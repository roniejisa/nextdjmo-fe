"use client";

import { useEffect, useRef } from "react";
import { drawHeart } from "./Effect/Heart";

const MouseEffect = ({ dependencies }) => {
  const { previewIndex } = dependencies;
  const canvasRef = useRef(null);

  const iconsRef = useRef([]); // Lưu trữ trái tim trong useRef thay vì useState

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let x, y;
    // Thiết lập kích thước canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Bán kính của con chuột và kích thước trái tim nhỏ
    const cursorRadius = 30;
    const smallHeartSize = 10;

    // Hàm vẽ trái tim

    // Hàm vẽ con chuột trên canvas
    const drawCursor = (x, y, type = "circle") => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas mỗi lần vẽ lại
      if (type === "circle") {
        ctx.beginPath();
        ctx.arc(
          x + cursorRadius / 2,
          y + cursorRadius / 2,
          cursorRadius,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.stroke();
        // Vẽ các trái tim nhỏ
        iconsRef.current.forEach((icon) => {
          drawHeart(ctx, icon.x, icon.y, smallHeartSize);
        });
      }
    };

    // Hàm tạo hiệu ứng tung tóe
    const startExplosion = (x, y) => {
      const newIcons = [];
      for (let i = 0; i < 2; i++) {
        // Tạo vị trí ngẫu nhiên cho các trái tim nhỏ
        const randomOffsetX = Math.random() * 100 - 50; // Tạo độ lệch ngẫu nhiên trong phạm vi -50 đến 50
        const randomOffsetY = Math.random() * 100 - 50; // Tạo độ lệch ngẫu nhiên trong phạm vi -50 đến 50

        newIcons.push({
          x: x + randomOffsetX, // Thêm độ lệch vào vị trí chuột
          y: y + randomOffsetY, // Thêm độ lệch vào vị trí chuột
          dy: Math.random() * 2 + 2,
        });
      }
      iconsRef.current = newIcons; // Lưu trái tim vào useRef
    };

    const updateIcons = () => {
      iconsRef.current = iconsRef.current
        ?.map((icon) => ({
          ...icon,
          y: icon.y + icon.dy,
        }))
        .filter((icon) => icon.y < canvas.height);
    };

    // Vòng lặp để cập nhật các trái tim nhỏ
    const animate = () => {
      updateIcons();
      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCursor(x, y, "circle");
      requestAnimationFrame(animate); // Vẽ lại mỗi frame
    };

    animate(); // Bắt đầu vòng lặp

    const handleMouseMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target;
      startExplosion(x, y); // Khi di chuột, tạo hiệu ứng tung tóe
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
      className="fixed top-0 z-[99999] left-0 w-full h-full pointer-events-none"
    />
  );
};

export default MouseEffect;
