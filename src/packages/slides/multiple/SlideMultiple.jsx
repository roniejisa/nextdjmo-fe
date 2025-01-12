import Skeleton from "@/components/Skeleton/Skeleton";
import React, { useState, useEffect, useRef } from "react";

const SlideMultiple = ({
  items,
  visibleCount = 3,
  component = Skeleton,
  fallback = Skeleton,
  heightItem = "200px",
  ...props
}) => {
  const [isCalculator, setIsCalculator] = useState(true);
  const hasInfinity = items.length > visibleCount;
  const indexRef = useRef(hasInfinity ? visibleCount : 0); // Vị trí hiện tại
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const startPosition = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const itemWidthRef = useRef(0);
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

  // Tính toán chiều rộng của mỗi item
  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    itemWidthRef.current = containerWidth / visibleCount;
    setIsCalculator(false);
  }, []);

  useEffect(() => {
    if (!itemWidthRef.current || !trackRef.current) return;
    for (let i = 0; i < trackRef.current.children.length; i++) {
      trackRef.current.children[i].style.width = `${itemWidthRef.current}px`;
    }
    changeIndex(indexRef.current);
  }, [isCalculator]);

  // Khi indexRef.current thay đổi, kiểm tra nếu đi ra khỏi ranh giới

  const changeIndex = (newIndex) => {
    prevTranslate.current = -(newIndex * itemWidthRef.current);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
    }
  };

  const handleButtonClick = (e, newIndex) => {
    e.stopPropagation();
    // Tránh việc đi ra ngoài phạm vi danh sách
    checkIndexRelated(newIndex);
    trackRef.current.style.transition = "transform 0.3s ease";
    // Cập nhật lại chỉ mục
    changeIndex(indexRef.current);
  };

  const checkInfinity = () => {
    if (!hasInfinity) return;
    let hasChange = false;
    if (indexRef.current >= extendedItems.length - visibleCount) {
      indexRef.current = visibleCount; // Quay lại đầu danh sách
      hasChange = true;
    } else if (indexRef.current <= 0) {
      indexRef.current = extendedItems.length - visibleCount; // Quay lại cuối danh sách
      hasChange = true;
    }
    if (hasChange) {
      trackRef.current.style.transition = "";
      changeIndex(indexRef.current);
    }
  };

  const handleDragStart = (event) => {
    if (!hasInfinity) return;
    event.preventDefault();
    startPosition.current = event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
    trackRef.current.style.transition = ""; // Tắt transition trong quá trình kéo
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDragMove = (event) => {
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

    // Giới hạn kéo không vượt qua đầu hoặc cuối
    if (currentTranslate.current > minTranslate) {
      currentTranslate.current = minTranslate; // Dừng lại ở đầu
    } else if (currentTranslate.current < maxTranslate) {
      currentTranslate.current = maxTranslate; // Dừng lại ở cuối
    }

    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const handleDragEnd = () => {
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
    checkIndexRelated(indexRef.current);
    checkInfinity();
    // Cập nhật index nếu có sự thay đổi
    trackRef.current.style.transition = "300ms ease";
    changeIndex(indexRef.current);
  };

  const checkIndexRelated = (newIndex) => {
    if (newIndex < 0) {
      indexRef.current = 0;
    } else if (
      newIndex >= extendedItems.length - 1 ||
      newIndex + visibleCount >= extendedItems.length
    ) {
      indexRef.current = extendedItems.length - visibleCount;
    } else {
      indexRef.current = newIndex;
    }
  };
  return (
    <div
      className="relative w-full overflow-hidden"
      ref={containerRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Slider Track */}
      <div className="w-full">
        {isCalculator ? (
          <div>
            {[...Array(visibleCount)].map((_, index) => (
              <ComponentFallback key={index} height={heightItem} />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="flex"
            onTransitionEnd={checkInfinity}
            style={{
              width: `${extendedItems.length * itemWidthRef.current}px`,
            }}
          >
            {extendedItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 "
                style={{
                  height: heightItem,
                }}
              >
                <Component index={index} item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nút Prev */}
      {hasInfinity && (
        <button
          onMouseDown={(e) =>
            handleButtonClick(e, indexRef.current - visibleCount)
          }
          onTouchStart={(e) =>
            handleButtonClick(e, indexRef.current - visibleCount)
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-full hover:bg-gray-800 focus:outline-none z-10"
        >
          Prev
        </button>
      )}

      {/* Nút Next */}
      {hasInfinity && (
        <button
          onMouseDown={(e) =>
            handleButtonClick(e, indexRef.current + visibleCount)
          }
          onTouchStart={(e) =>
            handleButtonClick(e, indexRef.current + visibleCount)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-full hover:bg-gray-800 focus:outline-none z-10"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default SlideMultiple;
