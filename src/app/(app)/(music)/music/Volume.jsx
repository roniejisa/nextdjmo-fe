import React, { useRef, useEffect, useCallback, useState } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useMusicContext } from "./MusicProvider";

// Utility function để check percent
const checkPercent = (percent) => {
  if (percent < 0) return 0;
  if (percent > 100) return 100;
  return percent;
};

// Convert percent to volume (0-1)
export const getSizeVolume = (percent) => {
  return ((1 / 100) * percent).toFixed(4);
};

const Volume = ({ onVolumeChange }) => {
  const { audioKaraokeElRef, audioElRef } = useMusicContext();
  
  // DOM refs
  const volumeRef = useRef(null);
  const volumeBackgroundRef = useRef(null);
  const volumeProcessRef = useRef(null);
  const processMainRef = useRef(null);
  const processPercentRef = useRef(null);

  // State for React rendering
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  // Refs for internal tracking
  const isDraggingRef = useRef(false);
  const previousVolumeRef = useRef(50);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);

  // Update DOM elements directly
  const updateVolumeDisplay = useCallback((newVolume) => {
    if (processMainRef.current) {
      processMainRef.current.style.height = `${newVolume}%`;
    }
    if (processPercentRef.current) {
      processPercentRef.current.textContent = `${Math.round(newVolume)}%`;
    }
  }, []);

  // Update audio volume
  const updateAudioVolume = useCallback((newVolume) => {
    const volumeValue = getSizeVolume(newVolume);

    if (audioElRef?.current) {
      audioElRef.current.volume = volumeValue;
    }
    if (audioKaraokeElRef?.current) {
      audioKaraokeElRef.current.volume = volumeValue;
    }

    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  }, [audioKaraokeElRef, audioElRef, onVolumeChange]);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume) => {
    const checkedVolume = checkPercent(newVolume);
    
    // Update React state
    setVolume(checkedVolume);

    if (checkedVolume > 0) {
      setIsMuted(false);
      previousVolumeRef.current = checkedVolume;
    }

    updateVolumeDisplay(checkedVolume);
    updateAudioVolume(checkedVolume);
  }, [updateVolumeDisplay, updateAudioVolume]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      const volumeToRestore = previousVolumeRef.current > 0 ? previousVolumeRef.current : 50;
      handleVolumeChange(volumeToRestore);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
      updateVolumeDisplay(0);
      updateAudioVolume(0);
    }
  }, [isMuted, volume, handleVolumeChange, updateVolumeDisplay, updateAudioVolume]);

  // Calculate volume from mouse/touch position
  const calculateVolumeFromPosition = useCallback((clientY, rect) => {
    const relativeY = clientY - rect.top;
    const percent = ((rect.height - relativeY) / rect.height) * 100;
    return checkPercent(percent);
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (!volumeProcessRef.current) return;

    isDraggingRef.current = true;
    setShowBackground(true);

    const rect = volumeProcessRef.current.getBoundingClientRect();
    const newVolume = calculateVolumeFromPosition(e.clientY, rect);

    handleVolumeChange(newVolume);

    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = newVolume;
  }, [calculateVolumeFromPosition, handleVolumeChange]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !volumeProcessRef.current) return;

    const rect = volumeProcessRef.current.getBoundingClientRect();
    const newVolume = calculateVolumeFromPosition(e.clientY, rect);

    handleVolumeChange(newVolume);
  }, [calculateVolumeFromPosition, handleVolumeChange]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setShowBackground(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (!volumeProcessRef.current) return;

    isDraggingRef.current = true;
    setShowBackground(true);

    const touch = e.touches[0];
    const rect = volumeProcessRef.current.getBoundingClientRect();
    const newVolume = calculateVolumeFromPosition(touch.clientY, rect);

    handleVolumeChange(newVolume);

    dragStartYRef.current = touch.clientY;
    dragStartHeightRef.current = newVolume;
  }, [calculateVolumeFromPosition, handleVolumeChange]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!isDraggingRef.current || !volumeProcessRef.current) return;

    const touch = e.touches[0];
    const rect = volumeProcessRef.current.getBoundingClientRect();
    const newVolume = calculateVolumeFromPosition(touch.clientY, rect);

    handleVolumeChange(newVolume);
  }, [calculateVolumeFromPosition, handleVolumeChange]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    isDraggingRef.current = false;
    setShowBackground(false);
  }, []);

  // Keyboard handler
  const handleKeyDown = useCallback((e) => {
    let newVolume = volume;
    if (e.which === 38) {
      newVolume += 10;
    }

    if (e.which === 40) {
      newVolume -= 10;
    }

    if (e.which === 40 || e.which === 38) {
      handleVolumeChange(newVolume);
    }
  }, [volume, handleVolumeChange]);

  // Global event listeners setup - FIXED VERSION
  // Separate effect for keyboard listeners
  useEffect(() => {
    const handleGlobalKeyDown = (e) => handleKeyDown(e);
    document.addEventListener("keydown", handleGlobalKeyDown);
    
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  // Separate effect for drag listeners
  useEffect(() => {
    if (!isDraggingRef.current) return;
    
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e) => handleTouchMove(e);
    const handleGlobalTouchEnd = (e) => handleTouchEnd(e);

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    document.addEventListener("touchend", handleGlobalTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Initialize volume
  useEffect(() => {
    updateAudioVolume(volume);
    updateVolumeDisplay(volume);
  }, [updateAudioVolume, updateVolumeDisplay, volume]);

  // Get volume icon based on current state
  const getVolumeIcon = useCallback(() => {
    if (isMuted || volume === 0) {
      return <VolumeX />;
    } else if (volume >= 66) {
      return <Volume2 />;
    } else if (volume >= 20) {
      return <Volume1 />;
    } else {
      return <VolumeX />;
    }
  }, [volume, isMuted]);

  return (
    <div className="volume" ref={volumeRef}>
      <span className="icon" onClick={toggleMute}>
        {getVolumeIcon()}
      </span>
      <div 
        className={`volume-background ${showBackground ? "show" : ""}`}
        ref={volumeBackgroundRef}
      >
        <div
          ref={volumeProcessRef}
          className="volume-process"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div 
            className="process-main" 
            ref={processMainRef}
            style={{ height: `${volume}%` }}
          >
            <span className="process-icon"></span>
            <span className="process-percent" ref={processPercentRef}>
              {Math.round(volume)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volume;