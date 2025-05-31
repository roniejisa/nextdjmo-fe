"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { LoadingContext } from "../LoadingProvider";

const ProgressTransition = () => {
  const { transition } = useContext(LoadingContext);
  const [init, setInit] = useState(false);
  const progressRef = useRef({
    el: null,
    progress: 0,
  });
  const animationRef = useRef(null);
  const isRunning = useRef(false);

  const runProgress = () => {
    if (!isRunning.current || !progressRef.current.el) return;

    if (progressRef.current.progress < 50) {
      progressRef.current.progress += 1;
    } else if (progressRef.current.progress < 90) {
      progressRef.current.progress += 0.5;
    } else if (progressRef.current.progress < 95) {
      progressRef.current.progress += 0.1;
    }
    
    updateProgress(progressRef.current.progress);
    
    if (isRunning.current) {
      animationRef.current = requestAnimationFrame(runProgress);
    }
  };

  const updateProgress = (percent) => {
    if (!progressRef.current.el) return;
    progressRef.current.progress = percent;
    progressRef.current.el.style.width = `${percent}%`;
  };

  const startProgress = () => {
    if (!progressRef.current.el) return;
    
    isRunning.current = true;
    progressRef.current.progress = 0;
    updateProgress(0);
    animationRef.current = requestAnimationFrame(runProgress);
  };

  const stopProgress = async () => {
    isRunning.current = false;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (!progressRef.current.el) return;

    try {
      // Animate to 100% quickly
      await progressRef.current.el.animate(
        { width: "100%" },
        { duration: 200, fill: "forwards" }
      ).finished;
      
      // Small delay before hiding
      setTimeout(() => {
        if (progressRef.current.el) {
          updateProgress(0);
        }
      }, 100);
    } catch (error) {
      // Fallback if animation fails
      updateProgress(0);
    }
  };

  useEffect(() => {
    if (!init) return;
    
    if (transition) {
      startProgress();
    } else {
      stopProgress();
    }

    return () => {
      isRunning.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [transition, init]);

  useEffect(() => {
    setInit(true);
  }, []);

  return (
    <>
      <style>
        {`
          .animate-progress {
            animation: progress 2s linear infinite;
          }
          @keyframes progress {
            to {
              filter: hue-rotate(360deg);
            }
          }
        `}
      </style>
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[9999]">
        <div
          className="h-full w-0 bg-red-500 animate-progress transition-all duration-200"
          ref={(el) => (progressRef.current.el = el)}
        />
      </div>
    </>
  );
};

export default ProgressTransition;