import React, { useEffect, useRef, useCallback } from "react";
import { useMusicContext } from "./MusicProvider";
import { checkPercent, toTime } from "./helper";

const ProgressTimer = () => {
  const {
    isDrag,
    isShowLyric,
    mainProgress,
    audioKaraokeElRef,
    audioElRef,
    timeEndLyricCurrent,
    timeStartLyricNext,
    percentCurrent,
    changeProcess,
    getTimeSecondHasPercent,
    checkHasAudioKaraoke,
    timeStartRef,
    checkDataLyric,
  } = useMusicContext();

  // Refs for DOM elements
  const playerRef = useRef(null);
  const timeEndRef = useRef(null);
  const processRef = useRef(null);
  const processInnerRef = useRef(null);
  const iconProcessRef = useRef(null);
  const timerProcessRef = useRef(null);

  // Refs for state values to avoid re-renders
  const widthProcessRef = useRef(0);
  const clientXIconProcessRef = useRef(0);
  const widthMainProcessRef = useRef(0);
  const dragClientXRef = useRef(0);
  const transformRef = useRef(0);

  // Memoized functions
  const toPercent = useCallback((width) => {
    const percent = checkPercent((width / widthProcessRef.current) * 100);
    return percent;
  }, []);

  const getTimeSong = useCallback(
    (percent) => {
      return toTime(getTimeSecondHasPercent(percent));
    },
    [getTimeSecondHasPercent]
  );

  const changeTimeStart = useCallback(
    (percent) => {
      if (timeStartRef.current) {
        timeStartRef.current.innerText = getTimeSong(percent);
      }
    },
    [getTimeSong, timeStartRef]
  );

  const changeProcessTimer = useCallback(
    (percent) => {
      if (timerProcessRef.current) {
        timerProcessRef.current.innerText = getTimeSong(percent);
      }
    },
    [getTimeSong]
  );

  const checkTimeLyric = useCallback(() => {
    timeEndLyricCurrent.current = null;
    timeStartLyricNext.current = null;
  }, [timeEndLyricCurrent, timeStartLyricNext]);

  const percentProcessUpdate = useCallback(() => {
    if (isShowLyric.current) {
      checkDataLyric();
    }
    percentCurrent.current = checkPercent(percentCurrent.current);
    const timeCurrent = getTimeSecondHasPercent(percentCurrent.current);

    if (audioElRef.current) {
      audioElRef.current.currentTime = timeCurrent;
    }

    if (checkHasAudioKaraoke() && audioKaraokeElRef.current) {
      audioKaraokeElRef.current.currentTime = timeCurrent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isShowLyric,
    percentCurrent,
    getTimeSecondHasPercent,
    audioElRef,
    audioKaraokeElRef,
    checkHasAudioKaraoke,
    checkDataLyric,
  ]);

  const showTimer = useCallback((clientX) => {
    if (!timerProcessRef.current || !processRef.current) return;

    timerProcessRef.current.classList.add("show");

    // Lấy bounds của process element
    const processRect = processRef.current.getBoundingClientRect();
    const timerWidth = timerProcessRef.current.clientWidth;

    // Tính position relative với process element
    let relativeX = clientX - processRect.left;

    // Đảm bảo timer không bị tràn ra ngoài process
    if (relativeX < timerWidth / 2) {
      relativeX = timerWidth / 2 - timerWidth / 2;
    } else if (relativeX > processRect.width - timerWidth / 2) {
      relativeX = processRect.width;
    }

    // Nếu timer có position absolute trong process container
    timerProcessRef.current.style.left = relativeX + "px";
  }, []);

  const hideTimer = useCallback(() => {
    if (timerProcessRef.current) {
      timerProcessRef.current.classList.remove("show");
    }
  }, []);

  useEffect(() => {
    const processEl = processRef.current;
    const processInnerEl = processInnerRef.current;
    const iconProcessEl = iconProcessRef.current;

    if (!processEl || !processInnerEl || !iconProcessEl) return;

    // Initialize width
    widthProcessRef.current = processInnerEl.clientWidth;

    // Mouse events
    const handleProcessMouseDown = (e) => {
      isDrag.current = true;
      widthMainProcessRef.current = e.offsetX;
      percentCurrent.current = toPercent(widthMainProcessRef.current);
      changeProcess(percentCurrent.current);
      clientXIconProcessRef.current = e.clientX;
    };

    const handleIconMouseDown = (e) => {
      e.stopPropagation();
      clientXIconProcessRef.current = e.clientX;
      widthMainProcessRef.current = mainProgress.current?.clientWidth || 0;
      isDrag.current = true;
    };

    const handleDocumentMouseMove = (e) => {
      if (isDrag.current) {
        dragClientXRef.current = e.clientX;
        transformRef.current = Math.abs(
          dragClientXRef.current - clientXIconProcessRef.current
        );

        let widthMainProcessCurrent =
          widthMainProcessRef.current + transformRef.current;
        if (dragClientXRef.current < clientXIconProcessRef.current) {
          widthMainProcessCurrent =
            widthMainProcessRef.current - transformRef.current;
        }

        percentCurrent.current = toPercent(widthMainProcessCurrent);
        changeProcess(percentCurrent.current);
        changeTimeStart(percentCurrent.current);
      }
    };

    const handleDocumentMouseUp = () => {
      if (isDrag.current) {
        checkTimeLyric();
        percentProcessUpdate();
      }
      isDrag.current = false;
      hideTimer();
    };

    const handleProcessMouseMove = (e) => {
      showTimer(e.clientX);

      if (e.target.classList.contains("process-icon")) {
        changeProcessTimer(percentCurrent.current);
      } else {
        changeProcessTimer(toPercent(e.offsetX));
      }
    };

    const handleProcessMouseLeave = () => {
      hideTimer();
    };

    // Touch events
    const handleProcessTouchStart = (e) => {
      isDrag.current = true;
      const rect = processEl.getBoundingClientRect();
      widthMainProcessRef.current = e.changedTouches[0].clientX - rect.left;
      percentCurrent.current = toPercent(widthMainProcessRef.current);
      changeProcess(percentCurrent.current);
      clientXIconProcessRef.current = e.changedTouches[0].clientX;
    };

    const handleIconTouchStart = (e) => {
      e.stopPropagation();
      clientXIconProcessRef.current = e.changedTouches[0].clientX;
      widthMainProcessRef.current = mainProgress.current?.clientWidth || 0;
      isDrag.current = true;
    };

    const handleDocumentTouchMove = (e) => {
      if (isDrag.current) {
        dragClientXRef.current = e.changedTouches[0].clientX;
        transformRef.current = Math.abs(
          dragClientXRef.current - clientXIconProcessRef.current
        );

        let widthMainProcessCurrent =
          widthMainProcessRef.current + transformRef.current;
        if (dragClientXRef.current < clientXIconProcessRef.current) {
          widthMainProcessCurrent =
            widthMainProcessRef.current - transformRef.current;
        }

        percentCurrent.current = toPercent(widthMainProcessCurrent);
        changeProcess(percentCurrent.current);
        changeTimeStart(percentCurrent.current);
      }
    };

    const handleDocumentTouchEnd = () => {
      if (isDrag.current) {
        checkTimeLyric();
        percentProcessUpdate();
      }
      isDrag.current = false;
      hideTimer();
    };

    const handleProcessTouchMove = (e) => {
      showTimer(e.changedTouches[0].clientX);

      if (e.target.classList.contains("process-icon")) {
        changeProcessTimer(percentCurrent.current);
      } else {
        const rect = processEl.getBoundingClientRect();
        const offsetX = e.changedTouches[0].clientX - rect.left;
        changeProcessTimer(toPercent(offsetX));
      }
    };

    // Add event listeners
    processEl.addEventListener("mousedown", handleProcessMouseDown);
    iconProcessEl.addEventListener("mousedown", handleIconMouseDown);
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
    processEl.addEventListener("mousemove", handleProcessMouseMove);
    processEl.addEventListener("mouseleave", handleProcessMouseLeave);

    // Touch events
    processEl.addEventListener("touchstart", handleProcessTouchStart);
    iconProcessEl.addEventListener("touchstart", handleIconTouchStart);
    document.addEventListener("touchmove", handleDocumentTouchMove);
    document.addEventListener("touchend", handleDocumentTouchEnd);
    processEl.addEventListener("touchmove", handleProcessTouchMove);

    // Cleanup
    return () => {
      processEl.removeEventListener("mousedown", handleProcessMouseDown);
      iconProcessEl.removeEventListener("mousedown", handleIconMouseDown);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      processEl.removeEventListener("mousemove", handleProcessMouseMove);
      processEl.removeEventListener("mouseleave", handleProcessMouseLeave);

      processEl.removeEventListener("touchstart", handleProcessTouchStart);
      iconProcessEl.removeEventListener("touchstart", handleIconTouchStart);
      document.removeEventListener("touchmove", handleDocumentTouchMove);
      document.removeEventListener("touchend", handleDocumentTouchEnd);
      processEl.removeEventListener("touchmove", handleProcessTouchMove);
    };
  }, [
    isDrag,
    mainProgress,
    percentCurrent,
    changeProcess,
    toPercent,
    changeTimeStart,
    changeProcessTimer,
    checkTimeLyric,
    percentProcessUpdate,
    showTimer,
    hideTimer,
  ]);

  return (
    <div className="player" ref={playerRef}>
      <span className="time-start" ref={timeStartRef}>
        00:00
      </span>
      <div className="process" ref={processRef}>
        <div className="process-inner" ref={processInnerRef}>
          <div className="process-main" ref={mainProgress}>
            <span className="process-icon" ref={iconProcessRef}></span>
            <span className="process-timer" ref={timerProcessRef}>
              00:00
            </span>
          </div>
        </div>
      </div>
      <span className="time-end" ref={timeEndRef}>
        00:00
      </span>
    </div>
  );
};

export default ProgressTimer;
