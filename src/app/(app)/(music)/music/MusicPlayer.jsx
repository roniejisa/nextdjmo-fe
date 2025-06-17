"use client";
import ImageCustom from "@/components/Maintain/Image";
import { renderToString } from "react-dom/server";

import "./assets/scss/player.scss";
import { useCallback, useContext, useEffect } from "react";
import { Link, Mic, MicOff, Pencil } from "lucide-react";
import useAudioDeviceDetector from "./useAudioDeviceDetector";
import Volume from "./Volume";
import { MusicContext } from "./MusicProvider";
import ProgressTimer from "./ProgressTimer";
import ActionPlayer from "./ActionPlayer";
import { KEY_PLAYLIST_MAIN, request, toTime } from "./helper";

var iconKaraoke = renderToString(<Mic />);
var iconNoKaraoke = renderToString(<MicOff />);

const MusicPlayer = () => {
  const {
    isPlay,
    isKaraoke,
    isShowLyric,
    changeProcess,
    percentCurrent,
    audioElRef,
    audioKaraokeElRef,
    checkDataLyric,
    timeUpdateHandle,
    checkHasAudioKaraoke,
    buttonPlayRef,
    checkLoopIfEnded,
    changeIconPlay,
    setLocalStorage,
    playlists,
    playListSearch,
    loadSongStart,
    changeTab,
    spanOverlayRef,
    tabRef,
    mainRef,
    songEl,
    footerRef,
    headerRef,
    headingSong,
    playlistEl,
    resetLyricVariable,
    karaokeContentEl,
    buttonGetLyric,
    isPlainTextLyricsShown,
    songIndexCurrent,
    addInfoKaraokeContent,
    setSizeAll,
    renderSongHome,
    initPlayList,
  } = useContext(MusicContext);

  useAudioDeviceDetector();
  const changeIconKaraoke = useCallback(() => {
    const buttonKaraoke = document.querySelector(".karaoke");
    const buttonKaraokeIcon = buttonKaraoke?.querySelector("button");

    // Logic xử lý audio
    if (isKaraoke.current && isShowLyric.current && isPlay.current) {
      audioElRef.current?.pause();
      // Đảm bảo karaoke audio cũng có event listener ended
      audioKaraokeElRef.current?.play();
    } else {
      if (!audioKaraokeElRef.current?.paused) {
        audioKaraokeElRef.current?.pause();
      }

      if (isPlay.current) {
        audioElRef.current?.play();
      } else {
        audioElRef.current?.pause();
      }
    }

    // Logic xử lý UI
    if (isKaraoke.current) {
      buttonKaraoke?.classList.add("active");
    } else {
      buttonKaraoke?.classList.remove("active");
    }

    if (buttonKaraokeIcon) {
      buttonKaraokeIcon.innerHTML = isKaraoke.current
        ? iconKaraoke
        : iconNoKaraoke;
    }
  }, [audioElRef, audioKaraokeElRef]);

  const handleLyricKaraokeClick = useCallback(() => {
    isShowLyric.current = !isShowLyric.current;

    if (!isPlay.current && isShowLyric.current) {
      buttonPlayRef.current.click();
    }

    resetLyricVariable();

    if (isShowLyric.current) {
      changeTab();
      // Tìm element lyricKaraoke một cách an toàn
      const lyricKaraoke = document.querySelector(".lyric");
      const karaokeScreenEl = document.querySelector(".karaoke-screen");

      if (lyricKaraoke) lyricKaraoke.classList.add("active");
      if (karaokeScreenEl) karaokeScreenEl.classList.add("show");

      addInfoKaraokeContent();
    } else {
      const lyricKaraoke = document.querySelector(".lyric");
      const karaokeScreenEl = document.querySelector(".karaoke-screen");

      if (lyricKaraoke) lyricKaraoke.classList.remove("active");
      if (karaokeScreenEl) karaokeScreenEl.classList.remove("show");

      isKaraoke.current = false;
    }

    changeIconKaraoke();
  }, [
    isPlay,
    buttonPlayRef,
    resetLyricVariable,
    changeTab,
    addInfoKaraokeContent,
    isKaraoke,
    changeIconKaraoke,
  ]);

  useEffect(() => {
    // Extend HTMLDivElement prototype
    function getElementRect(element) {
      const {
        clientHeight,
        clientLeft,
        clientTop,
        clientWidth,
        offsetHeight,
        offsetLeft,
        offsetTop,
        offsetWidth,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
      } = element;
      return {
        clientHeight,
        clientLeft,
        clientTop,
        clientWidth,
        offsetHeight,
        offsetLeft,
        offsetTop,
        offsetWidth,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
      };
    }

    // Animation frame polyfill
    var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

    var cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    // Initialize request endpoint
    request.setEndpoint("https://music-two-gules.vercel.app");

    // DOM element references
    var suggestions = document.querySelectorAll("[data-title]");
    var openMenuEl = headerRef.current.querySelector(".menu-open");
    var tabControl = headerRef.current.querySelector(".tab-control");
    var playerDashboard = document.querySelector(".player-dashboard");
    var player = document.querySelector(".player");
    var timeEnd = player?.querySelector(".time-end");
    var rightEl = playerDashboard?.querySelector(".right");
    var playerScreen = document.querySelector(".player-screen");
    var lyricKaraoke = rightEl?.querySelector(".lyric");
    var buttonKaraoke = rightEl?.querySelector(".karaoke");
    var disc = playerScreen?.querySelector(".player-screen .disc");
    var formSearch = document.querySelector(".form-search");
    var inputSearch = formSearch?.querySelector("input");
    var loadingHome = document.querySelector(".screen-left .loading");
    var loadingPlaylist = document.querySelector(".screen-right .loading");
    var homeContainer = document.querySelector(
      ".player-screen .home-container"
    );
    var searchContainer = document.querySelector(
      ".player-screen .search-container"
    );
    var searchEl = searchContainer?.querySelector(".search");
    var headingSearch = searchContainer?.querySelector(".heading");
    var searchTextEl = searchContainer?.querySelector("blockquote");
    var buttonSearchInSong = headingSong.current?.querySelector("button");
    var buttonHomeInSong = headingSearch?.querySelector("button");

    // Variables
    var playLines = null;
    var animationFrame;
    var animationDisc;
    var animationPlayLine = {};

    // Event handlers
    const handleSuggestionMouseEnter = function (e) {
      var title = this.dataset.title;
      const divTitle = document.createElement("div");
      divTitle.innerText = title;
      divTitle.classList.add("title-show");
      this.prepend(divTitle);
    };

    const handleSuggestionMouseLeave = function (e) {
      Array.from(this.children).forEach((item) => {
        if (item.classList.contains("title-show")) {
          item.remove();
        }
      });
    };

    const handleSearchInSongClick = function () {
      showOrHiddenElement(searchContainer, homeContainer, "show");
    };

    const handleHomeInSongClick = function () {
      showOrHiddenElement(homeContainer, searchContainer, "show");
    };

    const handleFormSearchSubmit = async function (e) {
      e.preventDefault();

      const value = inputSearch.value.trim();
      if (value === "") {
        inputSearch.focus();
        return alert("Vui lòng nhập dữ liệu 🤣!");
      }

      onOffLoading(loadingHome, true);

      const fetchWithFallback = async (requestFn) => {
        try {
          return await requestFn();
        } catch (error) {
          console.error("Request failed:", error);
          return { status: "Error", data: null };
        }
      };

      // Parallel API calls with built-in error handling
      const [responseZing, responseNCT, responseYoutube] = await Promise.all([
        fetchWithFallback(() =>
          request
            .setEndpoint("https://music-two-gules.vercel.app")
            .get(`/zing/search/${value}`)
        ),
        fetchWithFallback(() =>
          request
            .setEndpoint("https://music-two-gules.vercel.app")
            .get(`/nct/search/${value}`)
        ),
        fetchWithFallback(() =>
          request
            .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT_URL)
            .get(`api/youtube/${value}`)
        ),
      ]);

      // Reset search playlist
      playListSearch.current = [];

      // Process YouTube results
      if (
        responseYoutube.status === "OK" &&
        responseYoutube.data.status === 200
      ) {
        playListSearch.current = playListSearch.current.concat(
          responseYoutube.data.data
        );
      }

      // Process Zing results
      if (responseZing.status === "OK" && responseZing.data.status === 200) {
        playListSearch.current = playListSearch.current.concat(
          responseZing.data.data
        );
      }

      // Process NCT results
      if (responseNCT.status === "OK" && responseNCT.data.status === 200) {
        playListSearch.current = playListSearch.current.concat(
          responseNCT.data.data
        );
      }
      // Update UI
      searchTextEl.innerText = value;
      buttonSearchInSong.removeAttribute("hidden");
      changeTab("screen-home");

      await renderSongSearch();

      onOffLoading(loadingHome, false);
      showOrHiddenElement(searchContainer, homeContainer, "show");
      chooseSongSearch();
    };

    const handleOpenMenuClick = function () {
      if (tabControl.classList.contains("show")) {
        tabControl.classList.remove("show");
        setSizeMain();
        setSizeSongEl();
        setSizePlaylistEl();
      } else {
        tabControl.classList.add("show");
        setSizeMain(true);
        setSizeSongEl(true);
        setSizePlaylistEl(true);
      }
    };

    const handleKeyDown = function (e) {
      if (e.target.localName === "input") {
        return false;
      }
      if (e.which === 37) {
        if (isKaraoke.current) {
          audioKaraokeElRef.current.currentTime -= 1;
        } else if (audioElRef.current && !audioElRef.current.paused) {
          audioElRef.current.currentTime = Math.max(
            0,
            audioElRef.current.currentTime - 1
          );
        }
      }
      if (e.which === 39) {
        if (isKaraoke.current) {
          audioKaraokeElRef.current.currentTime += 1;
        } else {
          audioElRef.current.currentTime += 1;
        }
      }
      if (e.which === 32) {
        e.preventDefault();
        buttonPlayRef.current.click();
      }
      if (e.which === 75) {
        lyricKaraoke.click();
      }
      if (e.which === 78) {
        buttonNext.click();
      }
      if (e.which === 66 || e.which === 80) {
        buttonPrev.click();
      }
      if (e.which === 82 || e.which === 83) {
        buttonShuffle.click();
      }
      if (e.which === 76 || e.which === 79) {
        buttonLoop.click();
      }
    };

    const handleWindowResize = function () {
      setSizeAll();
    };

    // Audio event handlers
    const handleAudioLoadedData = function (e) {
      updateTimer();
      if (isPlay.current && isShowLyric.current) {
        animationFrame = requestAnimationFrame(timeUpdateHandle);
      }
    };

    const handleAudioPlay = function () {
      if (animationDisc) {
        animationDisc.play();
      } else {
        animationDisc = disc.animate(
          [
            {
              transform: "rotate(0deg)",
              transform: "rotate(360deg)",
            },
          ],
          {
            duration: 5000,
            easing: "linear",
            iterations: Infinity,
          }
        );
      }
      animationLine(true);
      if (checkHasAudioKaraoke()) {
        audioKaraokeElRef.current.pause();
      }
      changeIconKaraoke();
    };

    const handleAudioPause = function () {
      cancelAnimationFrame(animationFrame);
      if (animationDisc) {
        animationDisc.pause();
      }
      animationLine(false);
    };

    const handleAudioDurationChange = function () {
      if (isPlay.current) {
        playLines = document.querySelectorAll(".play-line");
        audioElRef.current.play();
        changeIconPlay();
      }
    };

    const handleAudioEnded = function () {
      checkLoopIfEnded();
    };

    const handleKaraokeClick = function () {
      isKaraoke.current = !isKaraoke.current;
      checkDataLyric();
      if (isKaraoke.current) {
        isPlainTextLyricsShown.current = false;
        changeTab();
      }

      if (isShowLyric.current === false) {
        lyricKaraoke.click();
      }
      changeIconKaraoke();
    };

    const handleGetLyricClick = async function () {
      // HTML Structure (thêm vào HTML của bạn)
      const modalHTML = ` <div id="linkInputModal" class="modal-overlay" style="display: none;"> <div class="modal-content"> <div class="modal-header"> <h3>Nhập Lời Bài Hát</h3> <button class="modal-close">&times;</button> </div> <div class="modal-body"> <textarea id="linkTextarea" placeholder="Nhập toàn bộ chữ hoặc theo đúng định dạng array [ { 'words': [ { 'startTime': 16940, 'endTime': 17440, 'data': 'Cỏ' }, { 'startTime': 17440, 'endTime': 17940, 'data': 'cây' }, { 'startTime': 17940, 'endTime': 18190, 'data': 'héo' },....]" rows="5" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" ></textarea> </div> <div class="modal-footer"> <button id="confirmBtn" class="btn-primary">Xác nhận</button> <button id="cancelBtn" class="btn-secondary">Hủy</button> </div> </div> </div>`;
      // CSS cho modal (thêm vào CSS của bạn)
      const modalCSS = ` .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; } .modal-content { background: white; border-radius: 8px; padding: 0; min-width: 400px; max-width: 60%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); } .modal-header { padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; } .modal-header h3 { margin: 0; color: #333; } .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; } .modal-close:hover { color: #333; } .modal-body { padding: 20px; } .modal-footer { padding: 15px 20px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end; } .btn-primary { background-color: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; } .btn-primary:hover { background-color: #0056b3; } .btn-secondary { background-color: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; } .btn-secondary:hover { background-color: #545b62; } `;
      // JavaScript Functions
      function showLinkInputModal() {
        document.body.insertAdjacentHTML("beforeend", modalHTML);

        // Thêm CSS - kiểm tra xem đã có style chưa để tránh duplicate
        if (!document.getElementById("linkModalStyle")) {
          const style = document.createElement("style");
          style.id = "linkModalStyle";
          style.textContent = modalCSS;
          document.head.appendChild(style);
        }

        const modal = document.getElementById("linkInputModal");
        const textarea = document.getElementById("linkTextarea");

        modal.style.display = "flex";
        textarea.focus();

        return new Promise((resolve, reject) => {
          const confirmBtn = document.getElementById("confirmBtn");
          const cancelBtn = document.getElementById("cancelBtn");
          const closeBtn = document.querySelector(".modal-close");

          function cleanup() {
            // Xóa hoàn toàn modal khỏi DOM
            modal.remove();
            // Có thể xóa style nếu muốn, nhưng thường để lại để tái sử dụng
            // document.getElementById('linkModalStyle')?.remove();
          }

          function handleConfirm() {
            const value = textarea.value.trim();
            cleanup();
            resolve(value);
          }

          function handleCancel() {
            cleanup();
            resolve(null);
          }

          // Event listeners
          confirmBtn.onclick = handleConfirm;
          cancelBtn.onclick = handleCancel;
          closeBtn.onclick = handleCancel;

          // Close khi click outside modal
          modal.onclick = (e) => {
            if (e.target === modal) {
              handleCancel();
            }
          };

          // Enter để confirm, Escape để cancel
          textarea.onkeydown = (e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleConfirm();
            } else if (e.key === "Escape") {
              handleCancel();
            }
          };
        });
      }

      const linkInput = await showLinkInputModal();

      if (!linkInput) {
        return; // User cancelled
      }

      playlists.current[songIndexCurrent.current]["lyrics"] = linkInput;
      karaokeContentEl.current.querySelector(".no-lyrics") &&
        karaokeContentEl.current.querySelector(".no-lyrics").remove();

      setLocalStorage(KEY_PLAYLIST_MAIN, playlists.current);

      const _id = playlists.current[songIndexCurrent.current]?.id;
      if (_id) {
        const data = await request
          .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT_URL)
          .post("api/save-lyrics-for-music/" + _id, {
            lyrics: linkInput,
          });
      }
    };

    // Utility functions
    function showOrHiddenElement(elementShow, elementHidden, className) {
      elementShow?.classList.add(className);
      elementHidden?.classList.remove(className);
    }

    function chooseSongHome() {
      Array.from(songEl.current.children).forEach((songItem) => {
        songItem.addEventListener("click", playSong);
      });
    }

    function chooseSongSearch() {
      Array.from(searchEl.children).forEach((songItem) => {
        songItem.addEventListener("click", playSong);
      });
    }

    async function playSong() {
      var songItem = this;
      var { type, id } = songItem.dataset;
      var index = playlists.current.findIndex(function (song) {
        if (song.type && song.id) {
          return song.type == songItem.dataset.type && song.id === id;
        }
        return false;
      });

      if (index !== -1) {
        if (songIndexCurrent.current === index) {
          buttonPlayRef.current.click();
          if (isPlay.current) {
            changeTab();
          }
          return false;
        }
        if (playlists.current[songIndexCurrent.current].lyrics) {
          addOrRemoveIconStartKaraoke();
        }
        songIndexCurrent.current = index;
      } else {
        let response;
        if (type === "youtube") {
          const title = songItem.getAttribute("title");
          const img =
            songItem.querySelector("img")?.getAttribute("src") ?? "/logo.png";
          const author = songItem.getAttribute("data-author");
          const lyrics = songItem.getAttribute("data-lyrics");

          const data = {
            data: {
              url:
                process.env.NEXT_PUBLIC_ENDPOINT_URL + `stream/youtube/${id}`,
              title: title,
              image: img,
              author: author,
              lyrics: lyrics ?? null,
            },
          };
          const status = "OK";
          response = { data, status };
        } else {
          response = await request
            .setEndpoint("https://music-two-gules.vercel.app")
            .get(`/${type}/song/${id}`);
        }
        const { data, status } = response;
        if (status === "OK" && data.data.url) {
          playlists.current.push({ type, id, ...data.data });
          if (playlists.current[songIndexCurrent.current].lyrics) {
            addOrRemoveIconStartKaraoke();
          }
          addAllEventNewSong(playlists.current.length - 1);
          songIndexCurrent.current = playlists.current.length - 1;
        } else {
          return alert("Vui lòng đăng ký VIP 😂!");
        }
      }
      if (!isPlay.current) {
        buttonPlayRef.current.click();
      }
      loadSongStart();
    }

    function addAllEventNewSong(index) {
      playlistEl.current.insertAdjacentHTML(
        "beforeend",
        renderSong(playlists.current[index])
      );

      const newSongElement = playlistEl.current.children[index];
      const handleNewSongClick = function (e) {
        audioElRef.current.pause();
        audioKaraokeElRef.current.pause();
        if (songIndexCurrent.current === index) {
          buttonPlayRef.current.click();
          if (isPlay.current) {
            changeTab();
          }
          return false;
        }
        if (playlists.current[songIndexCurrent.current].lyrics) {
          addOrRemoveIconStartKaraoke();
        }
        if (!isPlay.current) {
          buttonPlayRef.current.click();
        }
        songIndexCurrent.current = index;
        loadSongStart();
      };

      newSongElement.addEventListener("click", handleNewSongClick);
      setLocalStorage(KEY_PLAYLIST_MAIN, playlists.current);
      playLines = document.querySelectorAll(".play-line");
    }

    function renderSongSearch() {
      return new Promise((resolve) => {
        if (searchEl) {
          searchEl.innerHTML = playListSearch.current
            .map(
              (
                { title, id, type, image, author, duration, lyrics = "" },
                index
              ) =>
                `<div class="song-item" title="${title}" data-author="${author}" data-id="${id}" data-type="${type}" data-index="${index}" data-lyrics='${
                  lyrics ?? ""
                }'>
            <div class="image">
              ${
                image
                  ? `<img src="${image}" alt="${title}">`
                  : `<div class="image-placeholder">
                  <span>♪</span>
                  ${
                    duration
                      ? `<span class="duration-overlay">${duration}</span>`
                      : ""
                  }
                </div>`
              }
            </div>
            <div class="info">
              <h3 class="title">${title}</h3>
              <span class="author">${author}</span>
            </div>
          </div>`
            )
            .join("");
        }
        resolve(searchEl?.children);
      });
    }

    function onOffLoading(element, isLoading) {
      if (element) {
        if (isLoading) {
          element.classList.add("show");
        } else {
          element.classList.remove("show");
        }
      }
    }

    

    function animationLine(checkPlay = true) {
      if (!playLines) return;

      playLines.forEach(function (playLine, playLineIndex) {
        if (!animationPlayLine[playLineIndex]) {
          animationPlayLine[playLineIndex] = {};
        }
        Array.from(playLine.children).forEach(function (spanEl, index) {
          if (animationPlayLine[playLineIndex][index]) {
            if (checkPlay) {
              animationPlayLine[playLineIndex][index].play();
            } else {
              animationPlayLine[playLineIndex][index].pause();
            }
          } else {
            var { clientHeight } = getElementRect(
              spanEl.parentElement.parentElement
            );
            animationPlayLine[playLineIndex][index] = spanEl.animate(
              [
                {
                  height: "0px",
                  "max-height": "0px",
                },
                {
                  height: clientHeight - 12 + "px",
                  "max-height": clientHeight - 12 + "px",
                },
              ],
              {
                duration: 1000,
                delay: index * 150,
                easing: "ease-in-out",
                iterations: Infinity,
                direction: "alternate",
              }
            );
          }
        });
      });
    }

    function getAudioDuration() {
      if (checkHasAudioKaraoke() && isKaraoke.current) {
        return audioKaraokeElRef.current.duration;
      } else {
        return audioElRef.current.duration;
      }
    }

    function updateTimer(percent = 0) {
      percentCurrent.current = percent;
      changeProcess(percentCurrent.current);
      if (timeEnd) {
        timeEnd.innerText = toTime(getAudioDuration());
      }
    }

    function loadSongInList() {
      if (playlistEl.current) {
        playlistEl.current.innerHTML = playlists.current
          .map(function (song, index) {
            return renderSong(song);
          })
          .join("");
      }
      onOffLoading(loadingPlaylist, false);
    }

    function renderSong(song) {
      return `<div class="song">
      <div class="image">
        <img src="${song.image ? song.image : "/logo.png"}" alt="">
        <div class="play-line">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="info">
        <h3>${song.title}</h3>
      </div>
    </div>`;
    }

    function addOrRemoveIconStartKaraoke(isRemove = true) {
      const currentSong = playlists.current[songIndexCurrent.current];
      if (
        !currentSong.lyrics ||
        !Array.isArray(currentSong.lyrics) ||
        (Array.isArray(currentSong.lyrics) && currentSong.lyrics.length == 0)
      ) {
        return false;
      }
      var lyricFirst =
        playlists.current[songIndexCurrent.current].lyrics[0].words;
      var wordFirst = lyricFirst[0];
      var step = 1000;
      var initialValue = 8000;
      if (wordFirst.startTime < 1000) {
        initialValue = wordFirst.startTime;
        step = 100;
      }

      if (isRemove) {
        playlists.current[songIndexCurrent.current].lyrics[0].words =
          playlists.current[songIndexCurrent.current].lyrics[0].words.slice(3);
        return false;
      }

      playlists.current[songIndexCurrent.current].lyrics[0].words.unshift(
        {
          data: `<i class="fa-solid fa-microphone"></i>`,
          startTime: wordFirst.startTime - (initialValue - step),
          endTime: wordFirst.startTime - (initialValue - step * 2),
        },
        {
          data: `<i class="fa-solid fa-microphone"></i>`,
          startTime: wordFirst.startTime - (initialValue - step * 3),
          endTime: wordFirst.startTime - (initialValue - step * 4),
        },
        {
          data: `<i class="fa-solid fa-microphone"></i>`,
          startTime: wordFirst.startTime - (initialValue - step * 5),
          endTime:
            wordFirst.startTime - 500 > 0
              ? wordFirst.startTime - 500
              : wordFirst.startTime,
        }
      );
    }

    function initAudio() {
      if (!audioElRef.current) return;

      playLines = document.querySelectorAll(".play-line");

      // Audio event listeners
      audioElRef.current.addEventListener("loadeddata", handleAudioLoadedData);
      audioElRef.current.addEventListener("play", handleAudioPlay);
      audioElRef.current.addEventListener("pause", handleAudioPause);
      audioElRef.current.addEventListener("durationchange",handleAudioDurationChange);
      audioElRef.current.addEventListener("timeupdate", timeUpdateHandle);
      audioElRef.current.addEventListener("ended", handleAudioEnded);

      // Playlist event listeners
      Array.from(playlistEl.current.children).forEach(function (song, index) {
        const handlePlaylistSongClick = function (e) {
          if (songIndexCurrent.current === index) {
            buttonPlayRef.current.click();
            if (isPlay.current) {
              changeTab();
            }
            return false;
          }
          if (!isPlay.current) {
            buttonPlayRef.current.click();
          }
          if (playlists.current[songIndexCurrent.current].lyrics) {
            addOrRemoveIconStartKaraoke();
          }
          songIndexCurrent.current = index;
          loadSongStart();
        };
        song.addEventListener("click", handlePlaylistSongClick);
      });

      // Button event listeners
      if (buttonKaraoke) {
        buttonKaraoke.addEventListener("click", handleKaraokeClick);
      }
      if (buttonGetLyric.current) {
        buttonGetLyric.current.addEventListener("click", handleGetLyricClick);
      }
    }
    // Add event listeners
    suggestions.forEach((item) => {
      item.addEventListener("mouseenter", handleSuggestionMouseEnter);
      item.addEventListener("mouseleave", handleSuggestionMouseLeave);
    });

    if (buttonSearchInSong) {
      buttonSearchInSong.addEventListener("click", handleSearchInSongClick);
    }

    if (buttonHomeInSong) {
      buttonHomeInSong.addEventListener("click", handleHomeInSongClick);
    }

    if (lyricKaraoke) {
      lyricKaraoke.removeEventListener("click", handleLyricKaraokeClick);
      lyricKaraoke.addEventListener("click", handleLyricKaraokeClick);
    }

    if (formSearch) {
      formSearch.addEventListener("submit", handleFormSearchSubmit);
    }

    if (openMenuEl) {
      openMenuEl.addEventListener("click", handleOpenMenuClick);
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleWindowResize);

    // Initialize the app
    initPlayList().then((res) => {
      renderSongHome().then((res) => {
        setSizeAll();
        onOffLoading(loadingHome, false);
        chooseSongHome();
        loadSongInList();
        loadSongStart();
        initAudio();
        changeIconPlay();
      });
    });

    // Cleanup function
    return () => {
      // Clean up audio event listeners
      if (audioElRef.current) {
        audioElRef.current.removeEventListener("loadeddata",handleAudioLoadedData);
        audioElRef.current.removeEventListener("play", handleAudioPlay);
        audioElRef.current.removeEventListener("pause", handleAudioPause);
        audioElRef.current.removeEventListener( "durationchange", handleAudioDurationChange);
        audioElRef.current.removeEventListener("ended", handleAudioEnded);
        audioElRef.current.removeEventListener("timeupdate", timeUpdateHandle);
      }
      // Remove event listeners
      suggestions.forEach((item) => {
        item.removeEventListener("mouseenter", handleSuggestionMouseEnter);
        item.removeEventListener("mouseleave", handleSuggestionMouseLeave);
      });

      if (buttonSearchInSong) {
        buttonSearchInSong.removeEventListener(
          "click",
          handleSearchInSongClick
        );
      }

      if (buttonHomeInSong) {
        buttonHomeInSong.removeEventListener("click", handleHomeInSongClick);
      }

      if (lyricKaraoke) {
        lyricKaraoke.removeEventListener("click", handleLyricKaraokeClick);
      }

      if (formSearch) {
        formSearch.removeEventListener("submit", handleFormSearchSubmit);
      }

      if (openMenuEl) {
        openMenuEl.removeEventListener("click", handleOpenMenuClick);
      }

      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleWindowResize);

      

      if (buttonKaraoke) {
        buttonKaraoke.removeEventListener("click", handleKaraokeClick);
      }

      if (buttonGetLyric.current) {
        buttonGetLyric.current.removeEventListener(
          "click",
          handleGetLyricClick
        );
      }

      // Cancel any running animations
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      if (animationDisc) {
        animationDisc.cancel();
      }

      // Clean up playlist animations
      Object.values(animationPlayLine).forEach((lineAnimations) => {
        Object.values(lineAnimations).forEach((animation) => {
          if (animation && animation.cancel) {
            animation.cancel();
          }
        });
      });
    };
  }, [handleLyricKaraokeClick, changeIconKaraoke]);

  return (
    <>
      <header ref={headerRef}>
        <div className="debugger" style={{ color: "white" }}></div>
        <div className="header-container">
          <div className="logo">
            <a href="#">
              <ImageCustom
                width={0}
                height={0}
                src="/images/logo.svg"
                alt="Logo"
              />
            </a>
          </div>
          <div className="tab-control">
            <div className="tabs" ref={tabRef}>
              <button data-tab="screen-home">
                <span>Home</span>
              </button>
              <button data-tab="screen-main" className="selected">
                <span>Player</span>
              </button>
              <button data-tab="screen-playlist">
                <span>Playlist</span>
              </button>
              <div className="overlay" ref={spanOverlayRef}>
                <span></span>
              </div>
            </div>
          </div>
          <div className="header-form">
            <form className="form-search">
              <input type="text" placeholder="Tìm kiếm..." />
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
          <button className="menu-open">
            <i className="fa-solid fa-bars-staggered"></i>
          </button>
        </div>
      </header>
      <main ref={mainRef}>
        <div className="player-screen">
          <div className="screen-left" data-tab-content id="screen-home">
            <span className="loading show"></span>
            <div className="home-container show">
              <div className="heading" ref={headingSong}>
                <h2>
                  <i className="fa-solid fa-house"></i> Trang chủ
                </h2>
                <button className="to-search" hidden>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
              <div className="songs" ref={songEl}></div>
            </div>
            <div className="search-container">
              <div className="heading">
                <h2>
                  <i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm:{" "}
                  <blockquote></blockquote>
                </h2>
                <button className="to-home">
                  <i className="fa-solid fa-house"></i>
                </button>
              </div>
              <div className="search"></div>
            </div>
          </div>
          <div className="main show" data-tab-content id="screen-main">
            <div className="disc-overlay">
              <div className="disc"></div>
            </div>
            <div className="karaoke-screen">
              <div className="karaoke-action">
                <button
                  className="get-link"
                  title="Thêm Lyrics"
                  ref={buttonGetLyric}
                >
                  <Link />
                  <span>Thêm Lyrics</span>
                </button>
              </div>
              <div className="karaoke-content" ref={karaokeContentEl}></div>
            </div>
            <div className="song-info">
              <div className="play-line">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <h1>Ai hát em nghe</h1>
            </div>
          </div>
          <div className="screen-right" data-tab-content id="screen-playlist">
            <span className="loading show"></span>
            <div className="playlist" ref={playlistEl}></div>
          </div>
        </div>
      </main>
      <footer ref={footerRef}>
        <div className="player-dashboard">
          <ProgressTimer />
          <div className="toolbar">
            <div className="left">
              <div className="info-current">
                <div className="image">
                  <ImageCustom
                    width={0}
                    height={0}
                    src="/images/logo.svg"
                    alt="Tiêu đề"
                  />
                </div>
                <div className="info">
                  <h3 className="title"></h3>
                  <span className="author"></span>
                </div>
              </div>
            </div>
            <ActionPlayer />
            <div className="right">
              <div className="karaoke" data-title="Tách lời" hidden>
                <button className="karaoke-show">
                  <MicOff />
                </button>
              </div>
              <div className="lyric" data-title="Lời bài hát">
                <button className="karaoke-show">
                  <Pencil />
                </button>
              </div>
              <Volume
                onVolumeChange={(vol) => {
                  console.log("Âm lượng hiện tại: " + vol);
                }}
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default MusicPlayer;
