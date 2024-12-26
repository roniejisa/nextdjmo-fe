"use client";
import React, { useEffect, useRef } from "react";

const LunarEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Kích thước canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawPeachFlowerPetal = (x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x - size, y - size, x, y - size * 1.5); // Vẽ cạnh trái
      ctx.quadraticCurveTo(x + size, y - size, x, y); // Vẽ cạnh phải
      ctx.closePath();
      const gradient = ctx.createLinearGradient(x, y, x, y - size * 1.5);
      gradient.addColorStop(0, "#FFB6C1");
      gradient.addColorStop(1, "#FF69B4");
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawPlumFlowerPetal = (x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x - size, y - size * 1.5, x, y - size * 2); // Vẽ cạnh trái
      ctx.quadraticCurveTo(x + size, y - size * 1.5, x, y); // Vẽ cạnh phải
      ctx.closePath();
      const gradient = ctx.createLinearGradient(x, y, x, y - size * 2);
      gradient.addColorStop(0, "#FFD700");
      gradient.addColorStop(1, "#FF8C00");
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawFlower = (x, y, size) => {
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const petalX = x + Math.cos(angle) * size;
        const petalY = y + Math.sin(angle) * size;
        drawPeachFlowerPetal(petalX, petalY, size); // Vẽ cánh hoa đào
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước mỗi khung hình

      // Vẽ hoa đào tại vị trí ngẫu nhiên trên canvas
      drawFlower(Math.random() * canvas.width, Math.random() * canvas.height, 30);

      // Vẽ hoa mai tại vị trí khác trên canvas
      drawPlumFlowerPetal(Math.random() * canvas.width, Math.random() * canvas.height, 40);

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

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />;
};

export default LunarEffect;
