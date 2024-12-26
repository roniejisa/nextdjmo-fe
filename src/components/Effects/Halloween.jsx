"use client";

import React, { useEffect, useRef } from "react";

const HalloweenEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const icons = ["👻", "👽", "👾", "👹", "👺", "🦇", "🎃"]; // Icon ngẫu nhiên
    const fallingObjects = [];

    // Tạo các đối tượng rơi
    const createFallingObject = () => {
      const icon = icons[Math.floor(Math.random() * icons.length)]; // Chọn icon ngẫu nhiên
      const size = Math.random() * 30 + 20; // Kích thước 20-50px
      const x = Math.random() * canvas.width; // Vị trí ngang
      const y = -size; // Bắt đầu từ trên cùng
      const speed = Math.random() * 2 + 1; // Tốc độ rơi
      const rotation = Math.random() * 360; // Góc quay ban đầu
      const rotationSpeed = Math.random() * 0.1 - 0.05; // Tốc độ quay
      fallingObjects.push({ icon, x, y, size, speed, rotation, rotationSpeed });
    };

    // Vẽ một icon
    const drawIcon = (icon, x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.font = `${size}px serif`;
      ctx.fillText(icon, 0, 0);
      ctx.restore();
    };

    // Cập nhật và vẽ toàn bộ icon
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas

      // Cập nhật và vẽ từng icon
      fallingObjects.forEach((object, index) => {
        object.y += object.speed; // Di chuyển xuống dưới
        object.rotation += object.rotationSpeed; // Quay
        drawIcon(object.icon, object.x, object.y, object.size, object.rotation);

        // Loại bỏ icon nếu rơi khỏi màn hình
        if (object.y - object.size > canvas.height) {
          fallingObjects.splice(index, 1);
        }
      });

      requestAnimationFrame(render);
    };

    // Tạo icon định kỳ
    const interval = setInterval(() => {
      createFallingObject();
    }, 300); // Tạo icon mỗi 300ms

    render();

    // Cập nhật kích thước canvas khi thay đổi kích thước màn hình
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Đảm bảo canvas được vẽ lại sau khi thay đổi kích thước
      requestAnimationFrame(render);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default HalloweenEffect;