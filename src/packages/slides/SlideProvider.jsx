"use client";

import { createContext, useEffect, useRef, useState } from "react";
export const SlideContext = createContext();
const SlideProvider = ({
  slides,
  component,
  autoPlay = true,
  autoPlayTime = 5000,
  ms = 300,
  height = "100vh-200px",
  eventName = "slide-change",
  styleDotActive = "border-active bg-active",
  styleDotNotActive = "border-text-active bg-text-active",
  className = "",
}) => {
  const indexRef = useRef(1); // Index hiện tại
  const dotsRef = useRef([]); // Dot Elements
  const slideRef = useRef(null); // Slide Element
  const slideItemsRef = useRef([]); // Slide Item Elements
  const autoPlayRef = useRef(null); // Auto Play
  const offsetXRef = useRef(0); // Offset X
  const transformXRef = useRef(0); // Transform X
  const offsetXMove = useRef(0); // Offset X Move
  const Component = component; // Component tự thêm vào là đây
  const slideContainerRef = useRef(null);
  const isTransition = useRef("ok");
  const [items, setItems] = useState(() => {
    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];
    return [lastSlide, ...slides, firstSlide];
  }); // Xử lý đầu cuối

  const handleDotClick = (index) => {
    slideRef.current.style.transition = `transform ${ms}ms`;
    indexRef.current = index + 1;
    changeSlide(index + 1);
  };

  const changeSlide = (index, typeFirstOrLast = false) => {
    let indexDot = index;
    indexDot -= 1;
    if (typeFirstOrLast == "first") {
      indexDot = 0;
    } else if (typeFirstOrLast == "last") {
      indexDot = items.length - 3;
    }

    dotsRef.current.forEach((item, i) => {
      item.classList.remove(
        ...(i == indexDot
          ? styleDotNotActive.split(" ")
          : styleDotActive.split(" "))
      );
      item.classList.add(
        ...(i == indexDot
          ? styleDotActive.split(" ")
          : styleDotNotActive.split(" "))
      );
    });
    transformXRef.current = -(index * slideContainerRef.current.clientWidth);
    slideRef.current.style.transform = `translateX(-${
      index * slideContainerRef.current.clientWidth
    }px)`;
    clearTimeout(isTransition.current);
    isTransition.current = setTimeout(() => {
      isTransition.current = "ok";
    }, ms + 100);
    dispatchEventForComponent(index);
  };

  const dispatchEventForComponent = (index) => {
    if (
      typeof window !== "undefined" &&
      index != 0 &&
      index != items.length - 1
    ) {
      window.dispatchEvent(
        new CustomEvent(eventName, {
          detail: {
            index: index,
          },
        })
      );
    }
  };

  const handleActionChangeSlide = (index) => {
    if (isTransition.current !== "ok") return;
    slideRef.current.style.transition = `transform ${ms}ms`;
    isTransition.current = false;
    if (index < 0) {
      index = items.length - 1;
    } else if (index > items.length - 1) {
      index = 0;
    }
    indexRef.current = index;
    let typeFirstOrLast = false;
    if (index == 0) {
      typeFirstOrLast = "last";
    } else if (index == items.length - 1) {
      typeFirstOrLast = "first";
    }
    changeSlide(index, typeFirstOrLast);
  };

  const playAuto = () => {
    if (autoPlayRef.current || !autoPlay) return;
    autoPlayRef.current = setInterval(() => {
      handleActionChangeSlide(indexRef.current + 1);
    }, autoPlayTime);
  };

  const stopAuto = () => {
    if (autoPlayRef.current && autoPlay) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  useEffect(() => {
    dispatchEventForComponent(indexRef.current);
    const eventTransitionEnd = (e) => {
      let checkFirstOrLast = false;
      if (indexRef.current == 0) {
        indexRef.current = items.length - 2;
        checkFirstOrLast = true;
      } else if (indexRef.current == items.length - 1) {
        indexRef.current = 1;
        checkFirstOrLast = true;
      }
      if (checkFirstOrLast) {
        slideRef.current.style.transition = "";
      }
      checkFirstOrLast && changeSlide(indexRef.current);
    };
    if (slideRef.current) {
      slideRef.current.addEventListener("transitionend", eventTransitionEnd);

      return () => {
        slideRef.current.removeEventListener(
          "transitionend",
          eventTransitionEnd
        );
      };
    }
  }, []);
  useEffect(() => {
    // Tính toán kích thước ban đầu
    transformXRef.current = -(
      indexRef.current * slideContainerRef.current.clientWidth
    );
    slideRef.current.style.transform = `translateX(${transformXRef.current}px)`;
    slideRef.current.style.width = `${
      items.length * slideContainerRef.current.clientWidth
    }px`;
    if (slideItemsRef.current) {
      slideItemsRef.current.forEach((item) => {
        item.style.width = slideContainerRef.current.clientWidth + "px";
      });
    }

    // chạy autoplay
    playAuto();

    return () => stopAuto(); // Dọn dẹp interval khi component unmount
  }, []);

  const handleMouseUp = (e) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    const totalWidth = slideContainerRef.current.clientWidth;
    const spaceCheck = totalWidth / 4;
    const absOffsetX = Math.abs(offsetXMove.current);
    if (absOffsetX < spaceCheck) {
      handleActionChangeSlide(indexRef.current);
    } else if (offsetXMove.current < 0 && absOffsetX >= spaceCheck) {
      handleActionChangeSlide(indexRef.current + 1);
    } else if (offsetXMove.current > 0 && absOffsetX >= spaceCheck) {
      handleActionChangeSlide(indexRef.current - 1);
    }
    offsetXMove.current = 0;
    playAuto();
    handleAddOrRemoveCursor(false);
  };

  const handleMouseMove = (e) => {
    slideRef.current.style.transition = "";
    handleAddOrRemoveCursor(true);
    offsetXMove.current = e.clientX - offsetXRef.current;
    if (offsetXMove.current != 0 && autoPlay && autoPlayRef.current) {
      stopAuto();
    }
    const newTransformX = transformXRef.current + offsetXMove.current;
    slideRef.current.style.transform = `translateX(${newTransformX}px)`;
  };
  const handleMouseDown = (e) => {
    e.preventDefault();

    offsetXRef.current = e.clientX;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleAddOrRemoveCursor = (isAdd = false) => {
    if (isAdd) {
      slideRef.current.style.cursor = "grab";
    } else {
      slideRef.current.style.cursor = "default";
    }
  };

  return (
    <SlideContext.Provider
      value={{
        indexRef,
        dotsRef,
        slideRef,
        slideItemsRef,
        autoPlayRef,
        offsetXRef,
        transformXRef,
        offsetXMove,
        handleDotClick,
        changeSlide,
        handleActionChangeSlide,
        playAuto,
        stopAuto,
        handleAddOrRemoveCursor,
      }}
    >
      <div className={`${className}`}>
        <div
          ref={slideContainerRef}
          className="overflow-hidden relative group rounded-[inherit]"
        >
          <div
            ref={slideRef}
            className={`flex h-[calc(${height})]`}
            onMouseDown={handleMouseDown}
          >
            {items.map((slide, index) => {
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 h-screen relative`}
                  ref={(el) => (slideItemsRef.current[index] = el)}
                >
                  <Component item={slide} index={index} />
                </div>
              );
            })}
          </div>

          {/* Xử lý control */}
          <div>
            <div
              className="absolute flex gap-4 bottom-4 left-1/2 -translate-x-1/2"
              onMouseMove={stopAuto}
              onMouseLeave={playAuto}
            >
              {items
                .filter((_, index) => {
                  if (index == 0 || index == items.length - 1) return false;
                  return true;
                })
                .map((_, index) => {
                  return (
                    <span
                      ref={(el) => (dotsRef.current[index] = el)}
                      key={index}
                      onClick={handleDotClick.bind(null, index)}
                      className={`w-4 h-4 inline-block rounded-full border transition-all duration-${ms} cursor-pointer ${
                        indexRef.current == index + 1
                          ? styleDotActive
                          : styleDotNotActive
                      }`}
                    ></span>
                  );
                })}
            </div>
            <div>
              <button
                className={`text-active border border-text-active bg-text-active p-4 rounded-full absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-${ms} -translate-x-full group-hover:left-10 group-hover:translate-x-0 hover:bg-active hover:border-active hover:text-text-active`}
                onMouseMove={stopAuto}
                onMouseLeave={playAuto}
                onClick={() => handleActionChangeSlide(indexRef.current - 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" />
                  <path d="M5 12l4 4" />
                  <path d="M5 12l4 -4" />
                </svg>
              </button>
              <button
                className={`text-active absolute border border-text-active bg-text-active p-4 rounded-full top-1/2 -translate-y-1/2 right-0 transition-all duration-${ms} translate-x-full group-hover:right-10 group-hover:-translate-x-0 hover:bg-active hover:border-active hover:text-text-active`}
                onMouseMove={stopAuto}
                onMouseLeave={playAuto}
                onClick={() => handleActionChangeSlide(indexRef.current + 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" />
                  <path d="M15 16l4 -4" />
                  <path d="M15 8l4 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SlideContext.Provider>
  );
};

export default SlideProvider;
