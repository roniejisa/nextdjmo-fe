"use client";

import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { useMusicContext } from "./MusicProvider";

const ActionPlayer = () => {
  const {
    buttonPlayRef,
    isPlay,
    isKaraoke,
    checkLoopIfEnded,
    isLoop,
    isShuffle,
    audioElRef,
    audioKaraokeElRef,
    changeIconPlay,
  } = useMusicContext();

  const actionRef = useRef(null);

  function handlePlay() {
    if (isPlay.current) {
      isPlay.current = false;
      isKaraoke.current
        ? audioKaraokeElRef.current.pause()
        : audioElRef.current.pause();
    } else {
      isPlay.current = true;
      isKaraoke.current
        ? audioKaraokeElRef.current.play()
        : audioElRef.current.play();
    }
    changeIconPlay();
  }

  // Chuyển các handler thành useCallback để tránh tạo lại function
  const handleNext = useCallback(() => {
    checkLoopIfEnded(true, true);
  }, [checkLoopIfEnded]);

  const handlePrev = useCallback(() => {
    checkLoopIfEnded(false, true);
  }, [checkLoopIfEnded]);

  const toggleButtonState = useCallback((buttonClass, isActive) => {
    const button = actionRef.current?.querySelector(`.${buttonClass}`);
    if (button) {
      button.classList.toggle("active", isActive);
    }
  }, []);

  const handleShuffle = useCallback(() => {
    isShuffle.current = !isShuffle.current;
    toggleButtonState("shuffle", isShuffle.current);
  }, [isShuffle, toggleButtonState]);

  const handleLoop = useCallback(() => {
    isLoop.current = !isLoop.current;
    toggleButtonState("loop", isLoop.current);
  }, [isLoop, toggleButtonState]);

  useEffect(() => {
    const currentActionRef = actionRef.current;
    if (!currentActionRef) return;

    const buttonNext = currentActionRef.querySelector(".next");
    const buttonPrev = currentActionRef.querySelector(".prev");
    const buttonShuffle = currentActionRef.querySelector(".shuffle");
    const buttonLoop = currentActionRef.querySelector(".loop");

    // Thêm event listeners
    if (buttonNext) buttonNext.addEventListener("click", handleNext);
    if (buttonPrev) buttonPrev.addEventListener("click", handlePrev);
    if (buttonShuffle) buttonShuffle.addEventListener("click", handleShuffle);
    if (buttonLoop) buttonLoop.addEventListener("click", handleLoop);

    // Cleanup function để remove event listeners
    return () => {
      if (buttonNext) buttonNext.removeEventListener("click", handleNext);
      if (buttonPrev) buttonPrev.removeEventListener("click", handlePrev);
      if (buttonShuffle)
        buttonShuffle.removeEventListener("click", handleShuffle);
      if (buttonLoop) buttonLoop.removeEventListener("click", handleLoop);
    };
  }, [handleNext, handlePrev, handleShuffle, handleLoop]);

  return (
    <div className="middle actions" ref={actionRef}>
      <button className="shuffle" data-title="Ngẫu nhiên">
        <Shuffle />
      </button>
      <button className="prev" data-title="Bài trước đó">
        <SkipBack />
      </button>
      <button
        className="play big"
        data-title="Phát nhạc"
        onClick={handlePlay}
        ref={buttonPlayRef}
      >
        <Play />
      </button>
      <button className="next" data-title="Bài tiếp theo">
        <SkipForward />
      </button>
      <button className="loop" data-title="Lặp lại">
        <RotateCcw />
      </button>
    </div>
  );
};

export default ActionPlayer;
