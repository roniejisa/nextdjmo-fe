"use client";
import React, { useEffect, useRef } from "react";

const SpringEffect = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Kích thước canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const leaves = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 10 + 5,  // Kích thước lá
      speedX: Math.random() * 1 - 0.5,  // Di chuyển theo chiều ngang
      speedY: Math.random() * 1 + 1,    // Di chuyển theo chiều dọc
      rotation: Math.random() * 360,    // Góc quay của lá
    }));

    const drawLeaf = (x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180); // Chuyển đổi góc quay từ độ sang radian

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(size / 2, size / 2, 0, size);  // Phác thảo hình dáng lá
      ctx.quadraticCurveTo(-size / 2, size / 2, 0, 0);
      ctx.closePath();

      ctx.fillStyle = "green";  // Màu lá thu
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leaves.forEach((leaf) => {
        drawLeaf(leaf.x, leaf.y, leaf.size, leaf.rotation);

        // Di chuyển lá
        leaf.x += leaf.speedX;
        leaf.y += leaf.speedY;
        leaf.rotation += Math.random() * 2 - 1; // Làm lá quay

        // Khi lá di chuyển ra ngoài màn hình, đưa nó về lại phía trên
        if (leaf.y > canvas.height) {
          leaf.y = -leaf.size;
          leaf.x = Math.random() * canvas.width;
        }
        if (leaf.x > canvas.width || leaf.x < 0) {
          leaf.x = Math.random() * canvas.width;
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

export default SpringEffect;