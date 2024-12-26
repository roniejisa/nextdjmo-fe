"use client";
import React, { useEffect, useRef } from "react";

const ValentineEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Kích thước canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Khởi tạo các trái tim
    const hearts = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width, // Vị trí x ngẫu nhiên
      y: Math.random() * canvas.height, // Vị trí y ngẫu nhiên
      size: 1 + Math.random() * 20, // Kích thước ngẫu nhiên của trái tim
      opacity: Math.random(), // Độ mờ ban đầu
      blinkSpeed: 0.02 + Math.random() * 0.03, // Tốc độ nhấp nháy ngẫu nhiên
    }));

    const drawHeart = (x, y, size, opacity) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 2, x, y + size);
      ctx.bezierCurveTo(x + size, y + size / 2, x + size / 2, y - size / 2, x, y);
      ctx.fillStyle = `rgba(255, 105, 180, ${opacity})`; // Màu hồng với độ mờ
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước mỗi khung hình

      hearts.forEach((heart) => {
        drawHeart(heart.x, heart.y, heart.size, heart.opacity); // Vẽ trái tim với độ mờ

        // Thay đổi độ mờ để tạo hiệu ứng nhấp nháy
        heart.opacity += heart.blinkSpeed;
        if (heart.opacity > 1 || heart.opacity < 0) {
          heart.blinkSpeed = -heart.blinkSpeed; // Đổi hướng nhấp nháy khi độ mờ đạt max hoặc min
        }
      });

      requestAnimationFrame(render); // Tiếp tục vẽ các khung hình mới
    };

    render();

    // Cập nhật canvas khi thay đổi kích thước màn hình
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
};

export default ValentineEffect;
