"use client";

import React, { useEffect, useRef } from "react";

const NewYearEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];

    const createFirework = (x, y) => {
      const particles = [];
      const particleCount = 20; // Số lượng tia pháo hoa
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 2 + 2;
        particles.push({
          x,
          y,
          radius: 2,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          alpha: 1, // Độ trong suốt
          decay: Math.random() * 0.02 + 0.01, // Tốc độ phai mờ
        });
      }
      return particles;
    };

    const render = () => {
      ctx.fillStyle = "rgba(58, 0, 12, 1)"; // Làm mờ canvas dần
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Xử lý từng pháo hoa
      fireworks.forEach((firework, fireworkIndex) => {
        firework.y -= firework.speed;
        ctx.beginPath();
        ctx.arc(firework.x, firework.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        if (firework.y < firework.targetY) {
          if (!firework.particles) {
            firework.particles = createFirework(firework.x, firework.y);
          }

          firework.particles.forEach((particle, particleIndex) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.alpha -= particle.decay;
            particle.velocityY -= 0.05
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${particle.alpha})`;
            ctx.fill();
            ctx.closePath();

            if (particle.alpha <= 0) {
              firework.particles.splice(particleIndex, 1);
            }
          });

          if (firework.particles.length === 0) {
            fireworks.splice(fireworkIndex, 1);
          }
        }
      });

      requestAnimationFrame(render);
    };

    const addFirework = () => {
      const x = Math.random() * canvas.width;
      const y = canvas.height;
      const targetY = Math.random() * canvas.height * 0.5 + canvas.height * 0.2;
      const speed = Math.random() * 6 + 3;
      fireworks.push({ x, y, targetY, speed, particles: null });
    };

    const interval = setInterval(() => {
      addFirework();
    }, 800);

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
};

export default NewYearEffect;
