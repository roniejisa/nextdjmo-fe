"use client";

import { Pause, Play } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { renderToString } from "react-dom/server";
import {
  isMobile,
  KEY_HOME,
  KEY_PLAYLIST_MAIN,
  KEY_TIME_LAST_UPDATE,
  request,
  toTime,
} from "./helper";

// Create context with better default values
export const MusicContext = createContext({
  isPlay: { current: false },
  isDrag: { current: false },
});

// Custom hook for using the context with error checking
export const useMusicContext = () => {
  const context = useContext(MusicContext);

  if (!context || !context.isPlay) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }

  return context;
};

// Constants
const iconPlay = renderToString(<Play />);
const iconPause = renderToString(<Pause />);

const MusicProvider = ({ children }) => {
  // State management
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs for persistent values
  const isPlay = useRef(false);
  const isDrag = useRef(false);
  const isKaraoke = useRef(false);
  const isShuffle = useRef(false);
  const isLoop = useRef(false);
  const mainProgress = useRef(null);
  const percentCurrent = useRef(0);
  const audioElRef = useRef(null);
  const audioKaraokeElRef = useRef(null);
  const mainRef = useRef(null);
  const timeEndLyricCurrent = useRef(null);
  const timeStartLyricNext = useRef(null);
  const isShowLyric = useRef(false);
  const buttonPlayRef = useRef(null);
  const timeStartRef = useRef(null);
  const songIndexPrevious = useRef(0);
  const playlists = useRef([]);
  const playlistHome = useRef([]);
  const playListSearch = useRef([]);
  const changeTitle = useRef(null);
  const songElCurrent = useRef(null);
  const imageCurrent = useRef(null);
  const titleCurrent = useRef(null);
  const authorCurrent = useRef(null);
  const footerLeft = useRef(null);
  const tabControl = useRef(null);
  const tabRef = useRef(null);
  const buttonEls = useRef([]);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const spanOverlayRef = useRef(null);
  const songEl = useRef(null);
  const headingSong = useRef(null);
  const playlistEl = useRef(null);
  const currentIndexLyric = useRef(null);
  const wordsCurrent = useRef(null);
  const wordsNext = useRef(null);
  const elementLyric = useRef(null);
  const elementLyricNext = useRef(null);
  const elementLyricCurrent = useRef(null);
  const animationLyric = useRef(null);
  const songCurrentInfoEl = useRef(null);
  const karaokeContentEl = useRef(null);
  const songIndexCurrent = useRef(0);
  const animationFrame = useRef(null);
  const buttonKaraokeRef = useRef(null);
  const isPlainTextLyricsShown = useRef(false);
  const buttonGetLyric = useRef(null);

  // Local storage utilities with useCallback
  const setLocalStorage = useCallback((key, value) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
      return value;
    } catch (error) {
      console.error("Error setting localStorage:", error);
      return value;
    }
  }, []);

  const getLocalStorage = useCallback((key) => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      return null;
    } catch (error) {
      console.error("Error getting localStorage:", error);
      return null;
    }
  }, []);

  // Audio utility functions
  const getTimeSecondHasPercent = useCallback((percent) => {
    if (isKaraoke.current) {
      return (audioKaraokeElRef.current?.duration / 100) * percent || 0;
    } else {
      return (audioElRef.current?.duration / 100) * percent || 0;
    }
  }, []);

  const changeProcess = useCallback((percent) => {
    if (mainProgress.current) {
      mainProgress.current.style.width = percent + "%";
    }
  }, []);

  const checkHasAudioKaraoke = useCallback(() => {
    return (
      audioKaraokeElRef.current && !isNaN(audioKaraokeElRef.current.duration)
    );
  }, []);

  const secondTimeSongToPercent = useCallback((currentTime) => {
    const duration = isKaraoke.current
      ? audioKaraokeElRef.current?.duration
      : audioElRef.current?.duration;

    if (!duration || duration === 0) return 0;
    return (currentTime / duration) * 100;
  }, []);

  const changeIconPlay = useCallback(() => {
    if (buttonPlayRef.current) {
      buttonPlayRef.current.innerHTML = isPlay.current ? iconPause : iconPlay;
    }
  }, []);

  // New helper functions for audio
  const getTimeCurrent = useCallback(() => {
    if (isKaraoke.current && audioKaraokeElRef.current) {
      return audioKaraokeElRef.current.currentTime;
    } else if (audioElRef.current) {
      return audioElRef.current.currentTime;
    }
    return 0;
  }, []);

  const getPercentCurrent = useCallback(() => {
    const currentTime = getTimeCurrent();
    return secondTimeSongToPercent(currentTime);
  }, [getTimeCurrent, secondTimeSongToPercent]);

  const updateTimer = useCallback(
    (percent) => {
      const timeSecond = getTimeSecondHasPercent(percent);
      if (audioElRef.current) {
        audioElRef.current.currentTime = timeSecond;
      }
      if (checkHasAudioKaraoke() && audioKaraokeElRef.current) {
        audioKaraokeElRef.current.currentTime = timeSecond;
      }
    },
    [getTimeSecondHasPercent, checkHasAudioKaraoke]
  );

  const indexLyricZingMP3 = useCallback(
    (lyrics) => {
      const milliseconds = getTimeCurrent() * 1000;
      return lyrics.findIndex(function (current) {
        const words = current.words;
        if (milliseconds <= 1000 && words[0].startTime < 1000) {
          return true;
        }
        if (
          milliseconds >= words[0].startTime &&
          milliseconds <= words[words.length - 1].endTime
        ) {
          return true;
        }
      });
    },
    [getTimeCurrent]
  );

  const getLyricIndex = useCallback((index) => {
    return playlists.current[songIndexCurrent.current]?.lyrics?.[index];
  }, []);

  const getLyricDataZingMP3 = useCallback((lyrics, dataLyric) => {
    if (lyrics && lyrics.words) {
      lyrics.words.forEach(function (word) {
        const spanWord = document.createElement("span");
        spanWord.classList.add("word");
        const spanWordMain = document.createElement("span");
        spanWord.innerHTML = word.data;
        spanWordMain.innerHTML = word.data;
        spanWord.append(spanWordMain);
        dataLyric.elements.push({
          element: spanWord,
          main: spanWordMain,
          startTime: word.startTime,
          endTime: word.endTime,
        });
      });
    }
    return dataLyric;
  }, []);

  const appendNewDataZingMP3 = useCallback((dataLyric) => {
    if (dataLyric && dataLyric.html) {
      dataLyric.html.innerHTML = "";
      dataLyric.elements.forEach(function (data) {
        dataLyric.html.append(data.element);
      });
    }
    return dataLyric;
  }, []);

  const createElementKaraokeZingMP3 = useCallback(
    (lyrics) => {
      const dataLyric = {
        elements: [],
        html: null,
      };
      const divWords = document.createElement("div");
      divWords.classList.add("words");
      dataLyric.html = divWords;
      const updatedDataLyric = getLyricDataZingMP3(lyrics, dataLyric);
      return appendNewDataZingMP3(updatedDataLyric);
    },
    [getLyricDataZingMP3, appendNewDataZingMP3]
  );
  const changeWidthLyricCurrent = useCallback(() => {
    if (!elementLyricCurrent.current) {
      return false;
    }
    const milliseconds = getTimeCurrent() * 1000;
    const indexElement = elementLyricCurrent.current.elements.findIndex(
      function (element) {
        if (
          milliseconds >= element.startTime &&
          milliseconds <= element.endTime
        ) {
          return true;
        }
      }
    );

    if (indexElement !== -1) {
      const element = elementLyricCurrent.current.elements[indexElement];
      const totalTime = element.endTime - element.startTime;
      let percent = ((milliseconds - element.startTime) / totalTime) * 100;
      if (percent > 100) {
        percent = 100;
      }
      element.main.style.width = `${percent}%`;
    }

    elementLyricCurrent.current.elements =
      elementLyricCurrent.current.elements.filter(function (element) {
        if (milliseconds >= element.endTime) {
          element.main.style.width = `100%`;
          element.main.style.animation = `width 150ms linear`;
          return false;
        }
        return true;
      });
  }, [getTimeCurrent]);

  const zingMP3Lyric = useCallback(
    (lyricIndex) => {
      if (currentIndexLyric.current !== lyricIndex) {
        wordsCurrent.current = getLyricIndex(lyricIndex);
        wordsNext.current = getLyricIndex(lyricIndex + 1);

        if (!elementLyric.current) {
          elementLyric.current = createElementKaraokeZingMP3(
            lyricIndex % 2 === 0 ? wordsCurrent.current : wordsNext.current
          );
          if (karaokeContentEl.current && elementLyric.current?.html) {
            karaokeContentEl.current.append(elementLyric.current.html);
          }
        }

        if (!elementLyricNext.current) {
          elementLyricNext.current = createElementKaraokeZingMP3(
            lyricIndex % 2 === 0 ? wordsNext.current : wordsCurrent.current
          );
          if (karaokeContentEl.current && elementLyricNext.current?.html) {
            karaokeContentEl.current.append(elementLyricNext.current.html);
          }
        }

        if (wordsCurrent.current && wordsCurrent.current.words) {
          timeEndLyricCurrent.current =
            wordsCurrent.current.words[
              wordsCurrent.current.words.length - 1
            ].endTime;
        }
        if (wordsNext.current && wordsNext.current.words) {
          timeStartLyricNext.current =
            wordsNext.current.words[
              wordsNext.current.words.length - 1
            ].startTime;
        }

        if (
          lyricIndex % 2 === 0 &&
          elementLyricNext.current &&
          elementLyricNext.current.html
        ) {
          elementLyricNext.current = getLyricDataZingMP3(wordsNext.current, {
            elements: [],
            html: elementLyricNext.current.html,
          });
          elementLyricCurrent.current = elementLyric.current;
          animationLyric.current = elementLyricNext.current.html.animate(
            [{ opacity: 0 }],
            { duration: 400, fill: "forwards" }
          );

          animationLyric.current.finished
            .then(() => {
              appendNewDataZingMP3(elementLyricNext.current);
              return true;
            })
            .then(() => {
              if (elementLyricNext.current && elementLyricNext.current.html) {
                elementLyricNext.current.html.animate([{ opacity: 1 }], {
                  duration: 400,
                  fill: "forwards",
                });
              }
            });
        } else if (elementLyric.current && elementLyric.current.html) {
          elementLyric.current = getLyricDataZingMP3(wordsNext.current, {
            elements: [],
            html: elementLyric.current.html,
          });
          elementLyricCurrent.current = elementLyricNext.current;
          animationLyric.current = elementLyric.current.html.animate(
            [{ opacity: 0 }],
            { duration: 200, fill: "forwards" }
          );

          animationLyric.current.finished
            .then(() => {
              appendNewDataZingMP3(elementLyric.current);
              return true;
            })
            .then(() => {
              if (elementLyric.current && elementLyric.current.html) {
                elementLyric.current.html.animate([{ opacity: 1 }], {
                  duration: 200,
                  fill: "forwards",
                });
              }
            });
        }
      }

      if (elementLyricCurrent.current) {
        changeWidthLyricCurrent();
      }
      currentIndexLyric.current = lyricIndex;
    },
    [
      getLyricIndex,
      createElementKaraokeZingMP3,
      getLyricDataZingMP3,
      appendNewDataZingMP3,
      changeWidthLyricCurrent,
    ]
  );

  const setDataLyricZingMP3 = useCallback((element) => {
    if (element?.html) {
      element.html.remove();
    }
  }, []);

  const checkDataLyric = useCallback(() => {
    if (elementLyric.current) {
      setDataLyricZingMP3(elementLyric.current);
      elementLyric.current = null;
    }
    if (elementLyricNext.current) {
      setDataLyricZingMP3(elementLyricNext.current);
      elementLyricNext.current = null;
    }
    if (elementLyricCurrent.current) {
      setDataLyricZingMP3(elementLyricCurrent.current);
      elementLyricCurrent.current = null;
    }
    currentIndexLyric.current = null;
  }, [setDataLyricZingMP3]);

  const startAutoScroll = useCallback(() => {
    const scrollContainer = document.getElementById("plain-lyrics-content");
    if (!scrollContainer) return;

    const currentTime = getTimeCurrent();
    const songDuration =
      playlists.current[songIndexCurrent.current]?.duration || 180; // fallback 3 minutes

    // Calculate scroll speed based on song duration
    const scrollSpeed =
      (scrollContainer.scrollHeight - scrollContainer.clientHeight) /
      songDuration;

    // Smooth scroll based on current time
    const scrollPosition = currentTime * scrollSpeed;
    scrollContainer.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }, [getTimeCurrent]);

  // Helper function to display plain text lyrics
  const showPlainTextLyrics = useCallback((lyricsText) => {
    // Hide song info
    if (songCurrentInfoEl.current) {
      songCurrentInfoEl.current.setAttribute("hidden", "hidden");
    }

    // Show karaoke container
    if (karaokeContentEl.current) {
      karaokeContentEl.current.removeAttribute("hidden");

      // Clear existing content and display plain text
      const lyricsLines = lyricsText.split("\n");
      karaokeContentEl.current.innerHTML = `
      <div class="plain-text-lyrics">
        <div class="lyrics-content" id="plain-lyrics-content">
          ${lyricsLines
            .map(
              (line, index) =>
                `<p class="lyric-line" data-line="${index}">${
                  line || "&nbsp;"
                }</p>`
            )
            .join("")}
        </div>
      </div>
    `;

      // Optional: Auto-scroll functionality
      startAutoScroll(lyricsLines.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLyricKaraoke = useCallback(() => {
    const currentSong = playlists.current[songIndexCurrent.current];
    if (!currentSong?.lyrics) {
      buttonGetLyric.current.style.display = "flex";
      // Show button get lyric if no lyrics available
      return false;
    } else if (buttonGetLyric.current.style.display !== "none") {
      buttonGetLyric.current.style.display = "none";
    }

    const lyrics = currentSong.lyrics;

    // Check if lyrics is plain text (string) or structured array
    if (typeof lyrics === "string") {
      // Handle plain text lyrics - display full page
      if (!isPlainTextLyricsShown.current) {
        showPlainTextLyrics(lyrics);
        isPlainTextLyricsShown.current = true;
      }
      return true;
    }
    isPlainTextLyricsShown.current = false;

    const milliseconds = getTimeCurrent() * 1000;
    let lyricIndex =
      milliseconds <= 1000 ||
      !currentIndexLyric.current ||
      !timeStartLyricNext.current ||
      milliseconds >= timeEndLyricCurrent.current
        ? indexLyricZingMP3(lyrics)
        : currentIndexLyric.current;

    if (lyricIndex !== -1) {
      // Hide song info and show karaoke
      if (songCurrentInfoEl.current) {
        songCurrentInfoEl.current.setAttribute("hidden", "hidden");
      }
      zingMP3Lyric(lyricIndex);
    } else if (
      lyrics.length - 1 === currentIndexLyric.current ||
      !elementLyricCurrent.current ||
      (milliseconds < timeStartLyricNext.current &&
        milliseconds > timeEndLyricCurrent.current &&
        timeStartLyricNext.current - milliseconds > 10000)
    ) {
      // Show song info when no lyrics are active
      if (songCurrentInfoEl.current) {
        songCurrentInfoEl.current.removeAttribute("hidden");
      }
      if (
        karaokeContentEl.current &&
        !karaokeContentEl.current.hasAttribute("hidden")
      ) {
        checkDataLyric();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTimeCurrent, indexLyricZingMP3, zingMP3Lyric, checkDataLyric]);

  // Lyric management functions
  const resetLyricVariable = useCallback(() => {
    currentIndexLyric.current = null;
    wordsCurrent.current = null;
    wordsNext.current = null;
    elementLyric.current = null;
    elementLyricNext.current = null;
    elementLyricCurrent.current = null;
    songCurrentInfoEl.current = null;
    timeStartLyricNext.current = null;
    timeEndLyricCurrent.current = null;
    isPlainTextLyricsShown.current = false;
    if (karaokeContentEl.current) {
      karaokeContentEl.current.innerHTML = "";
    }
  }, []);

  const setDataDefaultKaraoke = useCallback((hasLyrics = true) => {
    const currentSong = playlists.current[songIndexCurrent.current];
    return `<div class="song-current">
                <div class="name">${currentSong?.title ?? "Đang cập nhật"}</div>
                <div class="author">${
                  currentSong?.author ?? "Đang cập nhật"
                }</div>
            </div>${
              hasLyrics
                ? ""
                : '<div class="no-lyrics">Xin lỗi lời bài hát này chưa được cập nhật</div>'
            }`;
  }, []);

  const addInfoKaraokeContent = useCallback(() => {
    if (karaokeContentEl.current) {
      const currentSong = playlists.current[songIndexCurrent.current];
      karaokeContentEl.current.insertAdjacentHTML(
        "afterbegin",
        setDataDefaultKaraoke(currentSong?.lyrics ?? false)
      );
      songCurrentInfoEl.current =
        karaokeContentEl.current.querySelector(".song-current");
    }
  }, [setDataDefaultKaraoke]);

  // Layout sizing functions
  const setSizeMain = useCallback((hasTab = false) => {
    if (!mainRef.current || !headerRef.current || !footerRef.current) return;

    const tabHeight = hasTab ? 50 : 0;
    const footerLeftHeight = footerLeft.current?.clientHeight || 0;

    if (isMobile) {
      mainRef.current.style.height = `calc(${window.innerHeight}px - ${headerRef.current.clientHeight}px - ${footerRef.current.clientHeight}px - ${footerLeftHeight}px - ${tabHeight}px)`;
    } else {
      mainRef.current.style.height = `calc(${window.innerHeight}px - ${headerRef.current.clientHeight}px - ${footerRef.current.clientHeight}px)`;
    }
  }, []);

  const setSizeSongEl = useCallback((hasTab = false) => {
    if (
      !songEl.current ||
      !headerRef.current ||
      !footerRef.current ||
      !headingSong.current
    )
      return;

    const tabHeight = hasTab ? 50 : 0;
    const heightMarginHeading = 20;
    const footerLeftHeight = footerLeft.current?.clientHeight || 0;

    if (isMobile) {
      songEl.current.style.maxHeight = `calc(${window.innerHeight}px - ${
        headerRef.current.clientHeight
      }px - ${footerRef.current.clientHeight}px - ${
        headingSong.current.clientHeight
      }px - ${
        heightMarginHeading * 2
      }px - ${tabHeight}px - ${footerLeftHeight}px)`;
    } else {
      songEl.current.style.maxHeight = `calc(${window.innerHeight}px - ${
        headerRef.current.clientHeight
      }px - ${footerRef.current.clientHeight}px - ${
        headingSong.current.clientHeight
      }px - ${heightMarginHeading * 2}px)`;
    }
  }, []);

  const setSizePlaylistEl = useCallback((hasTab = false) => {
    if (!playlistEl.current || !headerRef.current || !footerRef.current) return;

    const tabHeight = hasTab ? 50 : 0;
    const footerLeftHeight = footerLeft.current?.clientHeight || 0;

    if (isMobile) {
      playlistEl.current.style.maxHeight = `calc(${window.innerHeight}px - ${headerRef.current.clientHeight}px - ${footerRef.current.clientHeight}px - ${footerLeftHeight}px - ${tabHeight}px)`;
    } else {
      playlistEl.current.style.maxHeight = `calc(${window.innerHeight}px - ${headerRef.current.clientHeight}px - ${footerRef.current.clientHeight}px)`;
    }
  }, []);

  const setSizeAll = useCallback(() => {
    const hasTab = tabControl.current?.classList.contains("show") ?? false;
    setSizeMain(hasTab);
    if (spanOverlayRef.current && buttonEls.current[0]) {
      spanOverlayRef.current.style.width =
        buttonEls.current[0].clientWidth + "px";
      spanOverlayRef.current.style.left =
        6 + buttonEls.current[0].clientWidth + "px";
    }

    setSizeSongEl(hasTab);
    setSizePlaylistEl(hasTab);
  }, [setSizeMain, setSizeSongEl, setSizePlaylistEl]);

  // Tab management
  const changeTab = useCallback((type = "screen-main") => {
    const indexButtonTab = Array.from(buttonEls.current).findIndex(
      (button) => button.dataset.tab === type
    );
    if (indexButtonTab !== -1 && buttonEls.current[indexButtonTab]) {
      buttonEls.current[indexButtonTab].click();
    }
  }, []);
  // Time update handler
  const timeUpdateHandle = useCallback(() => {
    if (!isDrag.current && timeStartRef.current) {
      timeStartRef.current.innerText = toTime(getTimeCurrent());
      percentCurrent.current = getPercentCurrent();
      changeProcess(percentCurrent.current);
    }

    if (isPlay.current && isShowLyric.current) {
      // Clear previous frame trước khi tạo mới
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      animationFrame.current = requestAnimationFrame(timeUpdateHandle);
    }

    if (isShowLyric.current) {
      showLyricKaraoke();
    }
  }, [getTimeCurrent, getPercentCurrent, changeProcess, showLyricKaraoke]);

  // Audio karaoke initialization
  const initAudioKaraoke = useCallback(() => {
    if (!audioKaraokeElRef.current) return;

    const handleLoadedData = () => {
      updateTimer(percentCurrent.current);
    };

    const handlePause = () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioElRef.current) {
        audioElRef.current.currentTime = getTimeSecondHasPercent(
          percentCurrent.current
        );
      }
    };

    audioKaraokeElRef.current.addEventListener("loadeddata", handleLoadedData);
    audioKaraokeElRef.current.addEventListener("pause", handlePause);
    audioKaraokeElRef.current.addEventListener("timeupdate", timeUpdateHandle);

    // Return cleanup function
    return () => {
      if (audioKaraokeElRef.current) {
        audioKaraokeElRef.current.removeEventListener(
          "loadeddata",
          handleLoadedData
        );
        audioKaraokeElRef.current.removeEventListener("pause", handlePause);
        audioKaraokeElRef.current.removeEventListener(
          "timeupdate",
          timeUpdateHandle
        );
      }
    };
  }, [updateTimer, getTimeSecondHasPercent, timeUpdateHandle]);

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      // Cleanup audio references
      if (audioElRef.current) {
        audioElRef.current.pause();
      }
      if (audioKaraokeElRef.current) {
        audioKaraokeElRef.current.pause();
      }
    };
  }, []);
  // Playlist initialization
  const initPlayList = useCallback(async () => {
    if (isInitialized) return;

    try {
      const timeLastUpdate = getLocalStorage(KEY_TIME_LAST_UPDATE);
      if (
        timeLastUpdate &&
        timeLastUpdate + 60 * 10 * 1000 >= new Date().getTime()
      ) {
        playlistHome.current = getLocalStorage(KEY_HOME) || [];
        playlists.current = getLocalStorage(KEY_PLAYLIST_MAIN) || [];
      }

      if (playlists.current.length === 0) {
        const [responseDB, responseJson, responseHome] = await Promise.all([
          request
            .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT_URL)
            .get("api/get-list-music"),
          await fetch("/songs.json"),
          request
            .setEndpoint("https://music-two-gules.vercel.app")
            .get("/topSong"),
        ]);
        if (responseDB.status === "OK" && responseDB.data.status === 200) {
          playlists.current = responseDB.data.data;
        }
        if (!responseJson.ok) throw new Error("Failed to fetch playlist");
        playlists.current = playlists.current.concat(await responseJson.json());
        setLocalStorage(KEY_PLAYLIST_MAIN, playlists.current);
        setLocalStorage(KEY_TIME_LAST_UPDATE, new Date().getTime());
        if (responseHome?.status === 200 && responseHome.status === "OK") {
          playlistHome.current = responseHome.data.data;
          setLocalStorage(KEY_HOME, responseHome.data.data);
        }
      }
    } catch (error) {
      console.error("Error initializing playlist:", error);
    }
  }, [setLocalStorage, getLocalStorage, isInitialized]);
  // Song loading and management
  const loadSongStart = useCallback(() => {
    try {
      if (audioElRef.current) {
        try {
          audioElRef.current.pause();
          if (audioElRef.current.readyState >= 1) {
            audioElRef.current.currentTime = 0;
          }
        } catch (error) {
          console.error("Error controlling audio:", error);
        }
      }

      if (audioKaraokeElRef.current) {
        try {
          audioKaraokeElRef.current.pause();
          audioKaraokeElRef.current.currentTime = 0;
        } catch (error) {
          console.error("Error controlling karaoke audio:", error);
        }
      }

      changeTab();
      resetLyricVariable();

      // Update playlist UI
      if (playlistEl.current) {
        const activeElement = playlistEl.current.querySelector(".playing");
        if (activeElement) {
          activeElement.classList.remove("playing");
        }

        const currentElement =
          playlistEl.current.children[songIndexCurrent.current];
        if (currentElement) {
          songElCurrent.current = currentElement;
          currentElement.classList.add("playing");

          // Scroll to current song
          const elementRect = currentElement.getBoundingClientRect();
          const containerRect = playlistEl.current.getBoundingClientRect();
          const offsetTop = elementRect.top - containerRect.top;

          playlistEl.current.scrollTo({
            behavior: "smooth",
            top: playlistEl.current.scrollTop + offsetTop,
          });
        }
      }

      if (songIndexCurrent.current >= playlists.current.length) {
        songIndexCurrent.current = 0;
      } else if (songIndexCurrent.current < 0) {
        songIndexCurrent.current = playlists.current.length - 1;
      }

      const songCurrent = playlists.current[songIndexCurrent.current];
      if (!songCurrent) return;
      addInfoKaraokeContent();

      // Set audio sources
      if (audioElRef.current) {
        audioElRef.current.src = songCurrent.url;
        audioElRef.current.load();
      }

      // Handle karaoke
      if (songCurrent.urlKaraoke && audioKaraokeElRef.current) {
        audioKaraokeElRef.current.src = songCurrent.urlKaraoke;
        if (buttonKaraokeRef.current)
          buttonKaraokeRef.current.removeAttribute("hidden");
        initAudioKaraoke();
      } else {
        if (buttonKaraokeRef.current)
          buttonKaraokeRef.current.setAttribute("hidden", "");
        if (audioKaraokeElRef.current) audioKaraokeElRef.current.src = "";
        isKaraoke.current = false;
      }

      // Process lyrics
      if (
        songCurrent.lyrics &&
        Array.isArray(songCurrent.lyrics) &&
        songCurrent.lyrics.length > 0
      ) {
        if (!Array.isArray(songCurrent.lyrics[0]?.words)) {
          songCurrent.lyrics = songCurrent.lyrics.reduce(
            (newArray, lyric, index) => {
              const nextLyric = songCurrent.lyrics[index + 1];
              let endTime = 0;

              if (!nextLyric && lyric.words.trim() === "") {
                endTime = +lyric.startTimeMs + 500;
              } else {
                endTime =
                  lyric.endTimeMs && lyric.endTimeMs !== 0
                    ? lyric.endTimeMs
                    : nextLyric?.startTimeMs || +lyric.startTimeMs + 1000;
              }

              endTime -= Math.floor(Math.random() * 1000 + 500);
              const arrWords = lyric.words.split(" ");
              const totalTime = endTime - +lyric.startTimeMs;
              const oneTime = totalTime / arrWords.length;

              const words = arrWords.map((word, i) => ({
                data: word,
                startTime:
                  i === 0
                    ? +lyric.startTimeMs
                    : +lyric.startTimeMs + oneTime * i,
                endTime: +lyric.startTimeMs + oneTime * (i + 1),
              }));

              newArray.push({ words });
              return newArray;
            },
            []
          );
        }
      }

      // Update UI elements
      if (imageCurrent.current) {
        imageCurrent.current.src = songCurrent.image ?? "/logo.png";
        imageCurrent.current.alt = songCurrent.title;
      }
      if (authorCurrent.current)
        authorCurrent.current.innerText = songCurrent.author;
      if (titleCurrent.current)
        titleCurrent.current.innerText = songCurrent.title;
      if (changeTitle.current)
        changeTitle.current.innerText = songCurrent.title;

      // Set background image
      const imageUrl = !songCurrent.image
        ? "/logo.png"
        : /^https:\/\//.test(songCurrent.image)
        ? songCurrent.image
        : songCurrent.image.replace("./assets/", "");
      document.body.style.setProperty("--url-image", `url('${imageUrl}')`);
    } catch (error) {
      console.error("Error loading song:", error);
    }
  }, [changeTab, resetLyricVariable, addInfoKaraokeContent, initAudioKaraoke]);

  // Loop and shuffle logic
  const checkLoopIfEnded = useCallback(
    (isNext = true, checkLoop = false) => {
      try {
        // Reset audio time
        if (audioElRef.current && audioElRef.current.readyState >= 1) {
          audioElRef.current.currentTime = 0;
        }
        if (checkHasAudioKaraoke() && audioKaraokeElRef.current) {
          audioKaraokeElRef.current.currentTime = 0;
        }
        changeProcess(0);

        // Handle previous song in shuffle mode
        if (isShuffle.current && isNext && !checkLoop) {
          songIndexPrevious.current = songIndexCurrent.current;
        }

        if (
          !isNext &&
          isShuffle.current &&
          songIndexPrevious.current !== null &&
          songIndexCurrent.current !== songIndexPrevious.current
        ) {
          songIndexCurrent.current = songIndexPrevious.current;
          songIndexPrevious.current = null;
          loadSongStart();
          changeIconPlay();
          return;
        }

        // If loop is enabled and not forced to change
        if (isLoop.current && !checkLoop) {
          isPlay.current = true;
          loadSongStart();
          changeIconPlay();
          return;
        }

        // Change to next/previous song
        if (isShuffle.current && playlists.current.length > 1) {
          // Shuffle mode
          let newIndex = songIndexCurrent.current;
          let attempts = 0;
          const maxAttempts = Math.min(10, playlists.current.length);

          while (
            newIndex === songIndexCurrent.current &&
            attempts < maxAttempts
          ) {
            newIndex = Math.floor(Math.random() * playlists.current.length);
            attempts++;
          }

          if (newIndex === songIndexCurrent.current) {
            // Fallback: get next song
            newIndex =
              (songIndexCurrent.current + 1) % playlists.current.length;
          }

          songIndexCurrent.current = newIndex;
        } else {
          // Sequential mode
          if (isNext) {
            songIndexCurrent.current =
              (songIndexCurrent.current + 1) % playlists.current.length;
          } else {
            songIndexCurrent.current = songIndexCurrent.current - 1;
            if (songIndexCurrent.current < 0) {
              songIndexCurrent.current = playlists.current.length - 1;
            }
          }
        }

        loadSongStart();
        changeIconPlay();
      } catch (error) {
        console.error("Error in checkLoopIfEnded:", error);
      }
    },
    [loadSongStart, changeIconPlay, checkHasAudioKaraoke, changeProcess]
  );

  // Tab button event handlers
  const setupTabButtons = useCallback(() => {
    if (!tabRef.current) return;

    const tabContentEls = document.querySelectorAll("[data-tab-content]");
    const overlay = tabRef.current.querySelector(".overlay");
    const cleanupFunctions = [];

    buttonEls.current.forEach((buttonEl, index) => {
      // Remove existing event listeners to prevent duplicates
      const newButtonEl = buttonEl.cloneNode(true);
      buttonEl.parentNode.replaceChild(newButtonEl, buttonEl);
      buttonEls.current[index] = newButtonEl;

      const handleClick = (e) => {
        const buttonSelected = tabRef.current.querySelector(".selected");
        let changeTab = false;

        if (
          !newButtonEl.classList.contains("selected") &&
          buttonSelected?.classList.contains("selected")
        ) {
          changeTab = true;
        }

        if (changeTab || !tabContentEls[index]?.classList.contains("show")) {
          if (overlay && spanOverlayRef.current) {
            overlay.style.left =
              6 + spanOverlayRef.current.clientWidth * index + "px";
          }

          if (buttonSelected) buttonSelected.classList.remove("selected");
          newButtonEl.classList.add("selected");

          const tabContentShow = document.querySelector(
            "[data-tab-content].show"
          );
          if (tabContentShow) {
            tabContentShow.classList.remove("show");
            tabContentShow.style.zIndex = 1;
          }

          if (tabContentEls[index]) {
            tabContentEls[index].style.zIndex = 2;
            tabContentEls[index].classList.add("show");
          }

          if (
            newButtonEl.dataset.tab !== "screen-main" &&
            isShowLyric.current
          ) {
            const lyricKaraoke = document.querySelector("[data-lyric-karaoke]");
            if (lyricKaraoke) lyricKaraoke.click();
          }
        }
      };
      newButtonEl.addEventListener("click", handleClick);
      cleanupFunctions.push(() => {
        newButtonEl.removeEventListener("click", handleClick);
      });
    });
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, []);

  // Initialize audio elements
  const initializeAudio = useCallback(() => {
    audioElRef.current = new Audio();
    audioKaraokeElRef.current = new Audio();
  }, []);

  const renderSongHome = useCallback(() => {
    return new Promise((resolve) => {
      if (songEl.current) {
        songEl.current.innerHTML = playlistHome.current
          .map(
            ({ title, id, type, image, author }) =>
              `<div class="song-item" title="${title} - ${author}" data-id="${id}" data-type="${type}">
                <div class="image">
                  <img src="${image}" alt="">
                </div>
                <div class="info">
                  <h3 class="title">${title}</h3>
                  <span class="author">${author}</span>
                </div>
              </div>`
          )
          .join("");
      }
      resolve(songEl.current?.children);
    });
  }, []);

  const pauseMusic = useCallback(() => {
    try {
      // Dừng animation frame nếu đang chạy
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }

      // Cập nhật trạng thái play
      isPlay.current = false;

      // Pause audio chính
      if (audioElRef.current && !audioElRef.current.paused) {
        audioElRef.current.pause();
      }

      // Pause audio karaoke nếu có
      if (audioKaraokeElRef.current && !audioKaraokeElRef.current.paused) {
        audioKaraokeElRef.current.pause();
      }

      // Cập nhật icon button play
      changeIconPlay();

      // Dừng animation lyric nếu đang chạy
      if (animationLyric.current) {
        try {
          animationLyric.current.cancel();
        } catch (error) {
          // Animation có thể đã kết thúc, ignore error
          console.warn("Animation lyric already finished:", error);
        }
      }

      return true;
    } catch (error) {
      console.error("Error pausing music:", error);
      return false;
    }
  }, [changeIconPlay]);
  // Main initialization effect
  useEffect(() => {
    if (isInitialized) return;

    initializeAudio();

    // Initialize DOM references
    const playerDashboard = document.querySelector(".player-dashboard");
    const playerScreen = document.querySelector(".player-screen");

    if (headerRef.current) {
      tabControl.current = headerRef.current.querySelector(".tab-control");
    }

    if (playerScreen) {
      changeTitle.current = playerScreen.querySelector(".song-info h1");
    }

    if (playerDashboard) {
      const infoCurrent = playerDashboard.querySelector(".left .info-current");
      if (infoCurrent) {
        imageCurrent.current = infoCurrent.querySelector("img");
        titleCurrent.current = infoCurrent.querySelector(".title");
        authorCurrent.current = infoCurrent.querySelector(".author");
      }
    }

    if (footerRef.current) {
      footerLeft.current = footerRef.current.querySelector(".left");
    }

    if (tabRef.current) {
      buttonEls.current = Array.from(tabRef.current.querySelectorAll("button"));
      setupTabButtons();
    }
    buttonKaraokeRef.current = document.querySelector("[data-karaoke-button]");

    setIsInitialized(true);
  }, [
    isInitialized,
    initializeAudio,
    setupTabButtons,
    initPlayList,
    setSizeAll,
  ]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => setSizeAll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSizeAll]);

  // Memoized context value with complete dependencies

  const contextValue = useMemo(
    () => ({
      isPlay,
      isDrag,
      isKaraoke,
      isShowLyric,
      isShuffle,
      isLoop,
      mainProgress,
      percentCurrent,
      audioElRef,
      audioKaraokeElRef,
      buttonPlayRef,
      timeEndLyricCurrent,
      timeStartLyricNext,
      songIndexPrevious,
      timeStartRef,
      tabRef,
      playlists,
      playlistHome,
      playListSearch,
      isPlainTextLyricsShown,
      songIndexCurrent,
      animationLyric,
      karaokeContentEl,
      mainRef,
      songEl,
      footerRef,
      headerRef,
      headingSong,
      spanOverlayRef,
      playlistEl,
      buttonEls,
      buttonGetLyric,
      pauseMusic,
      showLyricKaraoke,
      resetLyricVariable,
      addInfoKaraokeContent,
      timeUpdateHandle,
      checkDataLyric,
      // All callback functions
      getTimeSecondHasPercent,
      changeProcess,
      checkHasAudioKaraoke,
      checkLoopIfEnded,
      changeIconPlay,
      setLocalStorage,
      getLocalStorage,
      loadSongStart,
      changeTab,
      resetLyricVariable,
      setSizeAll,
      timeUpdateHandle,
      initAudioKaraoke,
      getTimeCurrent,
      getPercentCurrent,
      updateTimer,
      showLyricKaraoke,
      setDataDefaultKaraoke,
      addInfoKaraokeContent,
      setSizeMain,
      setSizeSongEl,
      setSizePlaylistEl,
      initPlayList,
      setupTabButtons,
      initializeAudio,
      renderSongHome,
    }),
    [
      pauseMusic,
      renderSongHome,
      checkDataLyric,
      showLyricKaraoke,
      resetLyricVariable,
      addInfoKaraokeContent,
      timeUpdateHandle,
      getTimeSecondHasPercent,
      changeProcess,
      checkHasAudioKaraoke,
      checkLoopIfEnded,
      changeIconPlay,
      setLocalStorage,
      getLocalStorage,
      loadSongStart,
      changeTab,
      setSizeAll,
      initAudioKaraoke,
      getTimeCurrent,
      getPercentCurrent,
      updateTimer,
      setDataDefaultKaraoke,
      setSizeMain,
      setSizeSongEl,
      setSizePlaylistEl,
      initPlayList,
      setupTabButtons,
      initializeAudio,
    ]
  );

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
