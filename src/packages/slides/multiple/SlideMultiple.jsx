import Skeleton from "@/components/Skeleton/Skeleton";
import React, { useState, useEffect, useRef } from "react";

const SlideMultiple = ({
  items,
  visibleCount = 3,
  component = Skeleton,
  fallback = Skeleton,
  heightItem = "auto",
  gap = 0,
  options = {},
  ...props
}) => {
  const [isCalculator, setIsCalculator] = useState(true);
  const hasInfinity = items.length > visibleCount;
  const indexRef = useRef(hasInfinity ? visibleCount : 0); // Vị trí hiện tại
  const defaultVisibleCount = visibleCount;
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const startPosition = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const itemWidthRef = useRef(0);
  const timeOutRef = useRef("OK");
  const isDragging = useRef(0); // Biến cờ theo dõi trạng thái drag

  const ComponentFallback = fallback;
  const Component = component;
  // Tạo danh sách với các bản sao đầu/cuối để tạo hiệu ứng vô hạn
  const extendedItems =
    items.length > visibleCount
      ? [
          ...items.slice(-visibleCount), // Bản sao cuối
          ...items,
          ...items.slice(0, visibleCount), // Bản sao đầu
        ]
      : items;

  const handleResize = () => {
    if (!containerRef.current) return;
    const withCurrent = window.innerWidth;
    if (withCurrent < 576 && defaultVisibleCount > 1) {
      visibleCount = 1;
    } else if (withCurrent < 768 && defaultVisibleCount > 2) {
      visibleCount = 2;
    } else if (withCurrent < 1024 && defaultVisibleCount > 3) {
      visibleCount = 3;
    } else if (withCurrent < 1200 && defaultVisibleCount > 4) {
      visibleCount = 4;
    } else {
      visibleCount = defaultVisibleCount;
    }
    const containerWidth = containerRef.current.offsetWidth;
    itemWidthRef.current = containerWidth / visibleCount;
    for (let i = 0; i < trackRef.current.children.length; i++) {
      trackRef.current.children[i].style.width = `${itemWidthRef.current}px`;
    }
    changeIndex(indexRef.current);
  };
  // Resize tự động
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Tính toán chiều rộng của mỗi item
  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    itemWidthRef.current = containerWidth / visibleCount;
    setIsCalculator(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!itemWidthRef.current || !trackRef.current) return;
    handleResize();
    changeIndex(indexRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalculator]);

  // Khi indexRef.current thay đổi, kiểm tra nếu đi ra khỏi ranh giới

  const changeIndex = (newIndex) => {
    clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(() => {
      timeOutRef.current = "OK";
    }, 500);
    prevTranslate.current = -(newIndex * itemWidthRef.current);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
    }
  };

  const checkAndChangeOtherIndex = async (newIndex, type) => {
    indexRef.current = newIndex;
    const firstIndexMain = visibleCount;
    const lastIndexMain = firstIndexMain + items.length - 1;

    const lastIndex = extendedItems.length - 1;
    if (type === "next") {
      const endSlide = indexRef.current + visibleCount - 1;
      // Khi chuyển lên vị trí thì nó đã + 1 rồi nên cần - đi 1
      if (endSlide > lastIndex) {
        indexRef.current = indexRef.current - items.length - visibleCount;
        trackRef.current.style.transition = "";
        changeIndex(indexRef.current);
        return new Promise((resolve) => {
          indexRef.current += visibleCount;
          setTimeout(() => {
            resolve(indexRef.current);
          }, 100);
        });
      }
    } else if (type === "prev") {
      const endSlide = indexRef.current + visibleCount - 1;
      if (endSlide < visibleCount) {
        indexRef.current = indexRef.current + items.length + visibleCount;
        trackRef.current.style.transition = "";
        changeIndex(indexRef.current);
        return new Promise((resolve) => {
          indexRef.current -= visibleCount;
          setTimeout(() => {
            resolve(indexRef.current);
          }, 100);
        });
      }
    }

    return new Promise((resolve) => {
      resolve(indexRef.current);
    });
  };

  const handleButtonClick = async (e, newIndex, type) => {
    if (timeOutRef.current !== "OK") return;
    timeOutRef.current = "CHANGE";
    e.stopPropagation();
    // Tránh việc đi ra ngoài phạm vi danh sách
    indexRef.current = await checkAndChangeOtherIndex(newIndex, type);
    // Cập nhật lại chỉ mục
    trackRef.current.style.transition = "transform 2000ms ease";
    changeIndex(indexRef.current);
  };

  const checkInfinity = () => {
    if (!hasInfinity) return;
    trackRef.current.style.transition = "";
    let hasChange = false;
    if (indexRef.current >= extendedItems.length) {
      indexRef.current = visibleCount; // Quay lại đầu danh sách
      hasChange = true;
    } else if (indexRef.current <= 0) {
      indexRef.current = items.length; // Quay lại cuối danh sách
      hasChange = true;
    }
    if (hasChange) {
      changeIndex(indexRef.current);
      return true;
    }
  };

  const handleDragStart = (event) => {
    if (!hasInfinity) return;
    isDragging.current = false;
    event.preventDefault();
    startPosition.current = event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
    trackRef.current.style.transition = ""; // Tắt transition trong quá trình kéo
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
    changeCursor("grabbing");
  };

  const handleDragMove = (event) => {
    isDragging.current = true;
    event.preventDefault();
    const currentPosition = event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
    const distance = currentPosition - startPosition.current;

    // Cập nhật translateX mà không vượt qua giới hạn
    currentTranslate.current = prevTranslate.current + distance;

    // Tính toán các giới hạn kéo
    const maxTranslate =
      -(extendedItems.length - visibleCount) * itemWidthRef.current;
    const minTranslate = 0; // Không cho kéo qua đầu
    // Cho phép kéo thêm 1/2 phần tử trước khi snap lại
    const extraPull = (itemWidthRef.current / 3) * 2;
    // Giới hạn kéo không vượt qua đầu hoặc cuối
    if (currentTranslate.current > minTranslate) {
      currentTranslate.current = minTranslate - extraPull; // Dừng lại ở đầu
    } else if (currentTranslate.current < maxTranslate) {
      currentTranslate.current = maxTranslate + extraPull; // Dừng lại ở cuối
    }

    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const handleDragEnd = (event) => {
    event.preventDefault();
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("touchmove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
    // Tính toán khoảng cách di chuyển
    const movedBy = currentTranslate.current - prevTranslate.current;

    // Nếu di chuyển quá nửa một item, chuyển sang item tiếp theo hoặc trước đó
    const totalIndexMove = Math.floor(
      Math.abs(movedBy) / (itemWidthRef.current / 2)
    );

    if (movedBy < 0) {
      indexRef.current = indexRef.current + totalIndexMove;
    } else if (movedBy > 0) {
      indexRef.current = indexRef.current - totalIndexMove;
    }
    changeCursor();
    if (checkInfinity()) return;
    // Cập nhật index nếu có sự thay đổi
    trackRef.current.style.transition = "2000ms ease";
    changeIndex(indexRef.current);
  };

  const changeCursor = (type = "default") => {
    switch (type) {
      case "grabbing":
        document.body.style.cursor = "grabbing";
        break;
      case "grab":
        document.body.style.cursor = "grab";
        break;
      default:
        document.body.style.cursor = "default";
        break;
    }
  };

  const handleClick = (e) => {
    if (isDragging.current) {
      e.preventDefault();
    }
  };
  return (
    <div
      className="relative w-full group"
      ref={containerRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <div className="overflow-hidden">
        {/* Slider Track */}
        <div
          className="w-full"
          style={{
            paddingLeft: `${gap}px`,
            paddingRight: `${gap}px`,
            paddingTop: `${gap}px`,
            paddingBottom: `${gap}px`,
          }}
        >
          {isCalculator ? (
            <div>
              {[...Array(visibleCount)].map((_, index) => (
                <ComponentFallback key={index} height={heightItem} />
              ))}
            </div>
          ) : (
            <div
              ref={trackRef}
              className={`flex`}
              onTransitionEnd={checkInfinity}
              style={{
                marginLeft: `-${gap}px`,
                marginRight: `-${gap}px`,
                width: `${extendedItems.length * itemWidthRef.current}px`,
              }}
            >
              {extendedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{
                    paddingLeft: `${gap}px`,
                    paddingRight: `${gap}px`,
                    height: heightItem,
                  }}
                >
                  <Component index={index} item={item} onClick={handleClick} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        {/* Nút Prev */}
        {hasInfinity && (
          <button
            onMouseDown={(e) =>
              handleButtonClick(e, indexRef.current - visibleCount, "prev")
            }
            onTouchStart={(e) =>
              handleButtonClick(e, indexRef.current - visibleCount, "prev")
            }
            className="text-active border border-text-active bg-text-active p-4 rounded-full absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-300 opacity-0 group-hover:-translate-x-1/2 group-hover:opacity-100 hover:bg-active hover:border-active hover:text-text-active"
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
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l14 0"></path>
              <path d="M5 12l4 4"></path>
              <path d="M5 12l4 -4"></path>
            </svg>
          </button>
        )}

        {/* Nút Next */}
        {hasInfinity && (
          <button
            onMouseDown={(e) =>
              handleButtonClick(e, indexRef.current + visibleCount, "next")
            }
            onTouchStart={(e) =>
              handleButtonClick(e, indexRef.current + visibleCount, "next")
            }
            className="text-active absolute border border-text-active bg-text-active p-4 rounded-full top-1/2 -translate-y-1/2 right-0 transition-all duration-300 opacity-0 group-hover:translate-x-1/2 group-hover:opacity-100 hover:bg-active hover:border-active hover:text-text-active"
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
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l14 0"></path>
              <path d="M15 16l4 -4"></path>
              <path d="M15 8l4 4"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SlideMultiple;
