"use client";

import ImageCustom from "@/components/Maintain/Image";
import { showImageUrl } from "@/utils/client/util";
import { useEffect, useRef, useState } from "react";

const SlideComponent = ({ slides }) => {
  const indexRef = useRef(1);
  const dotsRef = useRef([]);
  const slideRef = useRef(null);
  const slideItemsRef = useRef([]);
  const autoPlayRef = useRef(null);
  const [items, setItems] = useState(() => {
    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];
    return [lastSlide, ...slides, firstSlide];
  });

  const handleDotClick = (index) => {
    slideRef.current.style.transition = "transform 0.5s";
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
      if (i == indexDot) {
        item.classList.add("bg-red-500");
        item.classList.remove("bg-white");
      } else {
        item.classList.remove("bg-red-500");
        item.classList.add("bg-white");
      }
    });
    slideRef.current.style.transform = `translateX(-${
      index * window.innerWidth
    }px)`;
  };

  useEffect(() => {
    const eventTransitionEnd = (e) => {
      let checkFirstOrLast = false;
      slideRef.current.style.transition = "";
      if (indexRef.current == 0) {
        indexRef.current = items.length - 2;
        checkFirstOrLast = true;
      } else if (indexRef.current == items.length - 1) {
        indexRef.current = 1;
        checkFirstOrLast = true;
      }
      setTimeout(() => {
        checkFirstOrLast && changeSlide(indexRef.current);
      }, 0);
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

  const handleActionChangeSlide = (index) => {
    slideRef.current.style.transition = "transform 0.5s";
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

  //   useEffect(() => {
  //     autoPlayRef.current = setInterval(() => {
  //       handleActionChangeSlide(indexRef.current + 1);
  //     }, 5000);

  //     return () => clearInterval(autoPlayRef.current); // Dọn dẹp interval khi component unmount
  //   }, []);

  return (
    <div className="overflow-hidden relative">
      <div
        ref={slideRef}
        className="flex h-[calc(100vh-200px)]"
        style={{
          transform: `translateX(-100svw)`,
          width: `${slides.length * 100}vw`,
        }}
      >
        {items.map((slide, index) => {
          return (
            <div
              key={index}
              className={`w-screen flex-shrink-0 h-screen relative`}
              ref={(el) => (slideItemsRef.current[index] = el)}
            >
              <ImageCustom
                src={showImageUrl(slide.image)}
                className="object-cover"
                fill={true}
                alt={slide.name}
              />
            </div>
          );
        })}
      </div>

      {/* Xử lý control */}
      <div>
        <div className="absolute flex gap-4 bottom-4 left-1/2 -translate-x-1/2">
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
                  className={`w-4 h-4 inline-block rounded-full  cursor-pointer ${
                    indexRef.current == index + 1 ? "bg-red-500" : "bg-white"
                  }`}
                ></span>
              );
            })}
        </div>
        <div className="absolute flex gap-4 top-4 right-4">
          <button
            className="text-white"
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
            className="text-white"
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
  );
};

export default SlideComponent;
