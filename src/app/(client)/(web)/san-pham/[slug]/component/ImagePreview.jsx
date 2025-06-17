import ImageCustom from "@/components/Maintain/Image";
import { useProductStore } from "@/stories/products/productStore";
import { showImageUrl } from "@/utils/client";
import React, { useEffect, useRef, useState } from "react";

const ImagePreview = () => {
  const { product, productCurrent, imageRef } = useProductStore();

  const divRef = useRef(null);
  const previewRef = useRef(null);
  const thumbRef = useRef(null);
  const [images, setImages] = useState(() => {
    let images = [productCurrent?.image];
    try {
      images = [...images, ...JSON.parse(product.images)];
    } catch (e) {}
    return images;
  });

  const [indexImage, setIndexImage] = useState(0);
  useEffect(() => {
    setImages(() => {
      let images = [productCurrent?.image];
      try {
        images = [...images, ...JSON.parse(product.images)];
      } catch (e) {}
      return images;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCurrent]);

  const handleChangeIndex = (index) => {
    if (index < 0) {
      index = images.length - 1;
    } else if (index > images.length - 1) {
      index = 0;
    }
    imageRef.current.src = showImageUrl(images[index]);
    setIndexImage(index);

    // Lấy ra height rồi / 2 nếu cái index * height của 1 index mà lớn hơn tổng thì trượt đến 1 nửa
    const halfThumbHeight = previewRef.current.offsetHeight / 2;
    const totalTop = index * 90 + 8 * index + 45;
    thumbRef.current.style.transition = "all 300ms ease";
    if (totalTop > halfThumbHeight) {
      thumbRef.current.style.transform = `translateY(-${
        totalTop - halfThumbHeight
      }px)`;
    } else {
      thumbRef.current.style.transform = null;
    }
  };

  useEffect(() => {
    function imageLen(element, elementImg) {
      const imgEl = element.querySelector(elementImg);
      let zoom,
        preview,
        zoomWidth,
        zoomHeight,
        widthRatio,
        heightRatio,
        maxLenSize,
        imageWidth,
        imageHeight;
      let minLenWidth = 50;
      let minLenHeight = 50;
      let scale = 10;
      let isShow = false;
      const rect = previewRef.current.getBoundingClientRect(); // Cập nhật rect mỗi lần chuột di chuyển
      const handleWheel = (e) => {
        e.preventDefault();
        const isZoomSmall = e.deltaY > 0;
        changeZoomLen(isZoomSmall);
        setPreview();
        update(e);
      };

      const handleMouseLeave = () => {
        checkPreview(true);
      };

      function update(event) {
        maxLenSize = imageWidth < imageHeight ? imageWidth : imageHeight;
        imageWidth = element.offsetWidth;
        imageHeight = element.offsetHeight;
        const rect = element.getBoundingClientRect(); // Cập nhật rect mỗi lần chuột di chuyển
        checkPreview();
        const data = getCursorPos(event, rect);
        let left = data.x - zoomWidth / 2;
        let top = data.y - zoomHeight / 2;

        if (data.x > imageWidth - zoomWidth / 2) {
          left = imageWidth - zoomWidth;
        } else if (data.x < zoomWidth / 2) {
          left = 0;
        }

        if (data.y > imageHeight - zoomHeight / 2) {
          top = imageHeight - zoomHeight;
        } else if (data.y < zoomHeight / 2) {
          top = 0;
        }

        zoom.style.left = left + "px";
        zoom.style.top = top + "px";

        // Tính tọa độ background position cho preview dựa trên tỉ lệ
        preview.style.backgroundPosition = `-${left * widthRatio}px -${
          top * heightRatio
        }px`;
      }
      function checkPreview(isOff = false) {
        if (!isShow) {
          isShow = true;
          preview = document.createElement("div");
          Object.assign(preview.style, {
            border: "1px solid #cacaca",
            boxShadow: "0 0 0 1px #cacaca",
            position: "fixed",
            top: rect.top + "px",
            width: "300px",
            height: "300px",
            backgroundColor: "#ffffff",
            left: rect.left + rect.width + 20 + "px",
          });

          zoom = document.createElement("div");
          Object.assign(zoom.style, {
            border: "1px solid #cacaca",
            width: imageWidth / 2 + "px",
            height: imageWidth / 2 + "px",
            position: "absolute",
            cursor: "pointer",
            zIndex: 10,
            background: "#ffffff20",
          });

          element.append(zoom);
          document.body.append(preview);
          zoomWidth = zoom.offsetWidth;
          zoomHeight = zoom.offsetHeight;
          setPreview();
        }

        if (isOff) {
          isShow = false;
          zoom.remove();
          preview.remove();
        }
      }
      function changeZoomLen(isZoomSmall) {
        if (isZoomSmall) {
          var widthValue = zoomWidth - (zoomWidth / 100) * scale;
          var heighValue = zoomHeight - (zoomHeight / 100) * scale;

          if (widthValue <= minLenWidth) {
            widthValue = minLenWidth;
          }

          if (heighValue <= minLenHeight) {
            heighValue = minLenHeight;
          }

          if (widthValue > heighValue) {
            heighValue = zoomHeight;
          }
        } else {
          var widthValue = zoomWidth + (zoomWidth / 100) * scale;
          var heighValue = zoomHeight + (zoomHeight / 100) * scale;
          if (widthValue >= maxLenSize) {
            widthValue = maxLenSize;
          }

          if (heighValue >= maxLenSize) {
            heighValue = maxLenSize;
          }
        }
        zoomWidth = widthValue;
        zoomHeight = heighValue;
        zoom.style.width = zoomWidth + "px";
        zoom.style.height = zoomHeight + "px";
      }

      function setPreview() {
        widthRatio = preview.offsetWidth / zoomWidth; // Tỉ lệ chiều rộng
        heightRatio = preview.offsetHeight / zoomHeight; // Tỉ lệ chiều cao
        preview.style.backgroundImage = `url(${imgEl.src})`;
        preview.style.backgroundColor = "white";
        preview.style.backgroundSize = `${imageWidth * widthRatio}px ${
          imageHeight * heightRatio
        }px`;
        preview.style.backgroundRepeat = "no-repeat";
      }

      function getCursorPos(e, rect) {
        var x = 0,
          y = 0;
        e = e || window.event;
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - rect.left;
        y = e.pageY - rect.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
      }

      element.addEventListener("mousemove", update);
      element.addEventListener("wheel", handleWheel);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", update);
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
    const imageGrassLen = imageLen(divRef.current, "img");
    return imageGrassLen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexImage]);
  const handleShowZoom = () => {};
  return (
    <div className="flex flex-wrap gap-4 group" ref={previewRef}>
      <div className="flex-[0_0_90px] gap-4 max-h-[calc(90px*5+16px*2)] overflow-hidden">
        <div className="flex flex-col gap-2" ref={thumbRef}>
          {images?.map((item, index) => {
            return (
              <div
                className={`relative w-[90px] transition-all duration-300 cursor-pointer h-[90px] shrink-0 border-2 ${
                  indexImage == index
                    ? "border-active"
                    : "border-transparent opacity-50"
                }`}
                key={index}
                onClick={() => handleChangeIndex(index)}
              >
                <ImageCustom
                  src={showImageUrl(item)}
                  alt={productCurrent?.name}
                  fill={true}
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="max-w-[calc(100%-90px-16px)] max-h-[calc(90px*5+16px*2)] w-full flex relative justify-center items-center overflow-hidden">
        <div
          className="relative w-auto h-auto max-h-full flex justify-center items-center aspect-auto"
          ref={divRef}
        >
          <ImageCustom
            ref={imageRef}
            src={showImageUrl(productCurrent?.image)}
            alt={productCurrent?.name}
            onClick={handleShowZoom}
            width={100}
            height={100}
            className="object-contain w-auto max-h-[calc(90px*5+16px*2)] bg-white"
          />
        </div>
        <div>
          <button
            className="absolute transition-all text-active bg-active-light duration-300 rounded-full border-active group-hover:left-4  w-8 h-8 flex justify-center items-center top-1/2 -translate-y-1/2 z-50 -left-full "
            onClick={() => handleChangeIndex(indexImage - 1)}
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
            className="absolute transition-all text-active bg-active-light duration-300 rounded-full border-active w-8 h-8 group-hover:right-4 flex justify-center items-center top-1/2 -translate-y-1/2 z-50 -right-full"
            onClick={() => handleChangeIndex(indexImage + 1)}
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

export default ImagePreview;