"use client";

const { useContext, useEffect, useState, useRef } = require("react");
const { LoadingContext } = require("../LoadingProvider");

const ProgressTransition = () => {
  const { transition } = useContext(LoadingContext);
  const [init, setInit] = useState(false);
  const progressRef = useRef({
    el: null,
    progress: 0,
  }); // Tham chiếu để lưu trạng thái progress
  const animationRef = useRef(null);
  const runProgress = () => {
    if (progressRef.current.progress < 50) {
      progressRef.current.progress += 1;
    } else if (progressRef.current.progress < 90) {
      progressRef.current.progress += 0.5;
    } else if (progressRef.current.progress < 100) {
      progressRef.current.progress += 0.01;
    }
    updateProgress(progressRef.current.progress);
    animationRef.current = requestAnimationFrame(runProgress);
  };
  const updateProgress = (percent) => {
    if (!progressRef.current.el) return;
    progressRef.current.progress = percent;
    progressRef.current.el.style.width = `${percent}%`;
  };
  const stopProgress = async () => {
    cancelAnimationFrame(animationRef.current);
    await progressRef.current.el.animate(
      { width: "100%", fill: "forwards" },
      { duration: 300 }
    ).finished;
    updateProgress(0);
  };
  useEffect(() => {
    if(!init) return
    if (transition) {
      animationRef.current = requestAnimationFrame(runProgress);
    } else {
      stopProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transition]);

    useEffect(() => {
      setInit(true);
    }, []);
  return (
    <>
      <style>
        {`
                .animate-progress {
                    animation: progress 1s linear infinite;
                }
                @keyframes progress {
                    to {
                        filter: hue-rotate(360deg);
                    }
                }`}
      </style>
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[9999]">
        <div
          className="h-full w-0 bg-red-500 animate-progress"
          ref={(el) => (progressRef.current.el = el)}
        ></div>
      </div>
    </>
  );
};

export default ProgressTransition;
