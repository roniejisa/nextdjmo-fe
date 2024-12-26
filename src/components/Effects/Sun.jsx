"use client";
import React, { useEffect, useRef } from "react";

const SunEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Kích thước canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Khởi tạo các mặt trời
    const suns = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width, // Vị trí x ngẫu nhiên
      y: Math.random() * canvas.height, // Vị trí y ngẫu nhiên (bắt đầu từ trên)
      radius: 2 + Math.random() * 10, // Bán kính của mặt trời
      speedX: Math.random() * 1 - 0.5, // Vận tốc theo chiều ngang
      speedY: Math.random() * 2 + 1, // Vận tốc theo chiều dọc
    }));

    const drawSun = (x, y, radius) => {
      // Vẽ hình mặt trời (vòng tròn)
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "yellow"; // Màu mặt trời
      ctx.fill();
      ctx.closePath();

      // Vẽ các tia sáng của mặt trời
      const rayLength = radius + 5;
      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i * Math.PI * 2) / rayCount;
        const startX = x + Math.cos(angle) * radius;
        const startY = y + Math.sin(angle) * radius;

        const endX = x + Math.cos(angle) * rayLength;
        const endY = y + Math.sin(angle) * rayLength;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "orange"; // Màu tia sáng
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước mỗi khung hình

      suns.forEach((sun) => {
        drawSun(sun.x, sun.y, sun.radius); // Vẽ mặt trời

        // Di chuyển mặt trời
        sun.x += sun.speedX; // Di chuyển theo chiều ngang
        sun.y += sun.speedY; // Di chuyển theo chiều dọc

        // Khi mặt trời rơi xuống dưới màn hình, cho nó quay lại từ trên
        if (sun.y > canvas.height) {
          sun.y = -sun.radius;
          sun.x = Math.random() * canvas.width; // Đặt lại vị trí x ngẫu nhiên
        }
        // Nếu mặt trời ra ngoài màn hình ở bên trái hoặc phải, đưa nó về lại bên trong
        if (sun.x > canvas.width || sun.x < 0) {
          sun.x = Math.random() * canvas.width;
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

export default SunEffect;
