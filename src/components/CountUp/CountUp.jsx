"use client";
import React, { useState, useEffect } from 'react';

const CountUp = ({ targetNumber = 100, duration = 500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const totalFrames = Math.round(duration / (1000 / 60)); // Số frame trong khoảng thời gian
    const increment = targetNumber / totalFrames; // Giá trị tăng mỗi frame
    let frame = 0;

    const step = () => {
      frame++;
      const newValue = Math.min(frame * increment, targetNumber);
      setCount(Math.round(newValue));
      if (frame < totalFrames) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetNumber, duration]);

  return <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{count}</div>;
};

export default CountUp;