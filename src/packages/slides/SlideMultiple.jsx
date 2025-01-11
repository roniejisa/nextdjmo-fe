import React, { useState, useEffect, useRef } from "react";

const SlideMultiple = ({ items, visibleCount = 3 }) => {
  const indexRef = useRef(visibleCount); // Vị trí hiện tại
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startPosition = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const itemWidthRef = useRef(0);

  // Tạo danh sách với các bản sao đầu/cuối để tạo hiệu ứng vô hạn
  const extendedItems = [
    ...items.slice(-visibleCount), // Bản sao cuối
    ...items,
    ...items.slice(0, visibleCount), // Bản sao đầu
  ];

  // Tính toán chiều rộng của mỗi item
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        itemWidthRef.current = containerWidth / visibleCount;
        for (let i = 0; i < trackRef.current.children.length; i++) {
          trackRef.current.children[
            i
          ].style.width = `${itemWidthRef.current}px`;
        }
        changeIndex(indexRef.current);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Khi indexRef.current thay đổi, kiểm tra nếu đi ra khỏi ranh giới

  const changeIndex = (newIndex) => {
    prevTranslate.current = -(newIndex * itemWidthRef.current);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
    }
  };

  const handleButtonClick = (e, newIndex) => {
    e.stopPropagation();
    e.preventDefault();
    let hasFirstOrLast = false;
    // Tránh việc đi ra ngoài phạm vi danh sách
    if (
      newIndex > extendedItems.length - visibleCount &&
      indexRef.current != extendedItems.length - visibleCount
    ) {
      indexRef.current = extendedItems.length - visibleCount; // Quay lại đầu danh sách
    } else if (newIndex < 0 && indexRef.current != 0) {
      indexRef.current = 0; // Quay lại cuối danh sách
    } else if (newIndex >= extendedItems.length - visibleCount) {
      indexRef.current = visibleCount;
      hasFirstOrLast = true;
    } else if (newIndex <= 0) {
      indexRef.current = extendedItems.length - visibleCount;
      hasFirstOrLast = true;
    } else {
      indexRef.current = newIndex;
    }
    trackRef.current.style.transition = "transform 0.3s ease";
    if (hasFirstOrLast) {
      trackRef.current.style.transition = "";
      changeIndex(indexRef.current);
    }
    // Cập nhật lại chỉ mục
    changeIndex(indexRef.current);
  };

  const handleTransitionEnd = (e) => {
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
    isDragging.current = true;
    startPosition.current = event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
    trackRef.current.style.transition = ""; // Tắt transition trong quá trình kéo
  };

  const handleDragMove = (event) => {
    if (!isDragging.current) return;

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
    isDragging.current = false;

    // Tính toán khoảng cách di chuyển
    const movedBy = currentTranslate.current - prevTranslate.current;
    let hasChange = false;

    // Nếu di chuyển quá nửa một item, chuyển sang item tiếp theo hoặc trước đó
    if (movedBy < -itemWidthRef.current / 2) {
      indexRef.current = indexRef.current + 1;
      hasChange = true;
    } else if (movedBy > itemWidthRef.current / 2) {
      indexRef.current = indexRef.current - 1;
      hasChange = true;
    }

    // Cập nhật vị trí dịch chuyển mới
    prevTranslate.current = -(indexRef.current * itemWidthRef.current);

    console.log(indexRef.current);
    // Tránh việc đi ra ngoài phạm vi danh sách
    if (indexRef.current >= extendedItems.length - visibleCount) {
      indexRef.current = visibleCount; // Quay lại đầu danh sách
      hasChange = true;
    } else if (indexRef.current <= 0) {
      indexRef.current = extendedItems.length - visibleCount; // Quay lại cuối danh sách
      hasChange = true;
    }

    // Đảm bảo transition sau khi kéo xong
    if (!hasChange) {
      // Chuyển động vô hạn khi nhả chuột
      prevTranslate.current = -(indexRef.current * itemWidthRef.current);
      trackRef.current.style.transition = "transform 0.3s ease";
      trackRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
    }

    // Cập nhật index nếu có sự thay đổi
    if (hasChange) {
      trackRef.current.style.transition = "";
      changeIndex(indexRef.current);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      ref={containerRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      {/* Nút Prev */}
      <button
        onMouseDown={(e) =>
          handleButtonClick(e, indexRef.current - visibleCount)
        }
        onTouchStart={(e) =>
          handleButtonClick(e, indexRef.current - visibleCount)
        }
        onMouseUp={(e) => handleButtonClick(e, indexRef.current - visibleCount)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-full hover:bg-gray-800 focus:outline-none z-10"
      >
        Prev
      </button>

      {/* Slider Track */}
      <div className="w-full">
        <div
          ref={trackRef}
          className="flex"
          onTransitionEnd={handleTransitionEnd}
          style={{
            width: `${extendedItems.length * itemWidthRef.current}px`,
          }}
        >
          {extendedItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 border border-gray-300 bg-gray-100 flex items-center justify-center"
              style={{
                width: `${itemWidthRef.current}px`,
                height: "200px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Nút Next */}
      <button
        onClick={(e) => handleButtonClick(e, indexRef.current + visibleCount)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-2 rounded-full hover:bg-gray-800 focus:outline-none z-10"
      >
        Next
      </button>
    </div>
  );
};

export default SlideMultiple;
