"use client";
import React, { useEffect, useRef } from "react";

const SnowEffect = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Kích thước canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,  // Kích thước bông tuyết
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 3 + 1,
    }));

    const drawSnowflake = (x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y);

      // Vẽ các cánh tuyết (với các đường chéo đối xứng)
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;  // Chia thành 6 góc (60 độ mỗi góc)
        const offsetX = Math.cos(angle) * size;
        const offsetY = Math.sin(angle) * size;
        
        ctx.lineTo(x + offsetX, y + offsetY);
        ctx.moveTo(x, y);  // Di chuyển lại vị trí trung tâm
      }

      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";  // Màu trắng cho bông tuyết
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";

      snowflakes.forEach((snowflake) => {
        drawSnowflake(snowflake.x, snowflake.y, snowflake.size);

        // Di chuyển bông tuyết
        snowflake.x += snowflake.speedX;
        snowflake.y += snowflake.speedY;

        // Khi bông tuyết rơi xuống dưới hoặc ra khỏi màn hình, đưa nó về lại phía trên
        if (snowflake.y > canvas.height) {
          snowflake.y = -snowflake.size;
          snowflake.x = Math.random() * canvas.width;
        }
        if (snowflake.x > canvas.width || snowflake.x < 0) {
          snowflake.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(render);
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

export default SnowEffect;