import ImageCustom from "@/components/Maintain/Image";
import { useProductStore } from "@/stories/products/productStore";
import { showImageUrl } from "@/utils/client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

const ImagePreview = () => {
  // Mock data for demo
  const { product, productCurrent } = useProductStore();
  // Mock 360 images - simulating different angles of the same product
  const mock360Images = [
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1230.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1231.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1232.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1233.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1234.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1235.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1236.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1237.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1238.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1239.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1240.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1241.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1242.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1243.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1244.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1245.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1246.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1247.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1248.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1249.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1250.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1251.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1252.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1253.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1254.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1255.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1256.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1257.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1258.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1259.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1260.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1261.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1262.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1263.jpg",
    "https://tramanh.art/wp-content/uploads/2021/04/IMG_1264.jpg",
  ];

  const divRef = useRef(null);
  const previewRef = useRef(null);
  const thumbRef = useRef(null);
  const imageRef = useRef(null);
  const animationRef = useRef(null);
  const preloadedImages = useRef(new Map());

  // Fixed container dimensions
  const FIXED_CONTAINER_WIDTH = 500;
  const FIXED_CONTAINER_HEIGHT = 500;

  const [images, setImages] = useState([]);
  const [images360, setImages360] = useState([]);
  const [indexImage, setIndexImage] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, angle: 0 });
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);
  const [current360Index, setCurrent360Index] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0); // Thêm state này
  const dragDirection = useRef(0); // Thêm ref này để track hướng
  const frameRef = useRef();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageIndicesMap = useMemo(() => {
    const map = new Map();
    for (let angle = 0; angle < 360; angle++) {
      const index = Math.floor((angle / 360) * images360.length);
      map.set(angle, Math.min(Math.max(0, index), images360.length - 1));
    }
    return map;
  }, [images360.length]);

  const throttledImageUpdate = useCallback(
    (angle) => {
      // Cho phép update ngay lập tức cho lần đầu tiên
      const shouldUpdate =
        !frameRef.current || Math.abs(angle - currentAngle) > 2;
      if (!shouldUpdate && frameRef.current) return;

      const normalizedAngle = Math.floor(angle) % 360;
      const imageIndex = imageIndicesMap.get(normalizedAngle) || 0;

      if (
        imageIndex !== currentImageIndex &&
        imageRef.current &&
        images360[imageIndex]
      ) {
        const preloadedImg = preloadedImages.current.get(images360[imageIndex]);
        if (preloadedImg && preloadedImg.complete) {
          imageRef.current.src = preloadedImg.src;
          setCurrentImageIndex(imageIndex);
        }
      }
    },
    [imageIndicesMap, currentImageIndex, images360]
  );

  // Preload 360 images for smooth performance
  const preload360Images = useCallback(async () => {
    if (!images360.length || isPreloading) return;

    setIsPreloading(true);

    // Preload 8 ảnh đầu tiên trước (priority)
    const priorityImages = images360.slice(0, 16);
    await Promise.all(
      priorityImages.map((src) => {
        return new Promise((resolve) => {
          if (preloadedImages.current.has(src)) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => {
            preloadedImages.current.set(src, img);
            resolve();
          };
          img.onerror = resolve;
          img.src = src;
        });
      })
    );

    // Preload phần còn lại (bỏ qua 8 ảnh đầu đã preload)
    const batchSize = 8;
    for (let i = 8; i < images360.length; i += batchSize) {
      // BẮT ĐẦU TỪ INDEX 8
      const batch = images360.slice(i, i + batchSize);

      await Promise.all(
        batch.map((src) => {
          return new Promise((resolve) => {
            if (preloadedImages.current.has(src)) {
              resolve();
              return;
            }

            const img = new Image();
            img.onload = () => {
              preloadedImages.current.set(src, img);
              resolve();
            };
            img.onerror = resolve;
            img.src = src;
          });
        })
      );

      // Small delay between batches to avoid blocking
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    setIsPreloading(false);
  }, [images360]);

  useEffect(() => {
    setImages(() => {
      let images = [productCurrent?.image];
      try {
        images = [...images, ...JSON.parse(product.images)];
      } catch (e) {}
      return images;
    });
    setImages360(mock360Images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCurrent]);

  // Preload images when 360 images are available
  useEffect(() => {
    if (images360.length > 0) {
      preload360Images();
    }
  }, [images360, preload360Images]);

  // Check if 360 images are available
  const has360Images = images360 && images360.length > 8;

  // Optimized function to update 360 image
  const update360Image = useCallback(
    (imageIndex) => {
      if (!imageRef.current || !images360[imageIndex]) return;

      const preloadedImg = preloadedImages.current.get(images360[imageIndex]);
      if (preloadedImg) {
        // Use preloaded image for smoother transition
        imageRef.current.src = preloadedImg.src;
      } else {
        // Fallback to direct src assignment
        imageRef.current.src = images360[imageIndex];
      }
      setCurrent360Index(imageIndex);
    },
    [images360]
  );

  // Auto rotation effect with optimized performance
  useEffect(() => {
    if (!is360Mode || !isAutoRotating) return;

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      const targetFPS = 60;
      const frameTime = 1000 / targetFPS;

      if (deltaTime >= frameTime * 0.8) {
        setCurrentAngle((prev) => {
          const newAngle = (prev - rotationSpeed * (deltaTime / 16)) % 360; // Normalize to 16ms
          const normalizedAngle = newAngle < 0 ? newAngle + 360 : newAngle;

          // Update image immediately
          throttledImageUpdate(normalizedAngle);

          return normalizedAngle;
        });

        // Deceleration
        setRotationSpeed((prev) => {
          const newSpeed = prev * 0.998; // Slower deceleration
          if (Math.abs(newSpeed) < 0.05) {
            setIsAutoRotating(false);
            return 0;
          }
          return newSpeed;
        });

        lastTime = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [is360Mode, isAutoRotating, throttledImageUpdate]);

  const handleChangeIndex = (index) => {
    if (is360Mode) return;

    if (index < 0) {
      index = images.length - 1;
    } else if (index > images.length - 1) {
      index = 0;
    }

    setIndexImage(index);
    if (imageRef.current) {
      imageRef.current.src = images[index];
    }

    const halfThumbHeight = previewRef.current?.offsetHeight / 2 || 250;
    const totalTop = index * 103 + 12 * index + 51;
    if (thumbRef.current) {
      thumbRef.current.style.transition = "all 300ms ease";
      if (totalTop > halfThumbHeight) {
        thumbRef.current.style.transform = `translateY(-${
          totalTop - halfThumbHeight
        }px)`;
      } else {
        thumbRef.current.style.transform = "translateY(0)";
      }
    }
  };

  const toggle360Mode = async () => {
    if (!has360Images) return;

    setIs360Mode(!is360Mode);
    setIsDragging(false);
    setCurrentAngle(0);
    setIsAutoRotating(false);
    setRotationSpeed(0);
    setCurrent360Index(0);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (!is360Mode && imageRef.current) {
      // Switch to 360 mode

      // Đảm bảo ảnh đầu tiên load xong trước
      const firstImg = new Image();
      if (preloadedImages.current.has(images360[0])) {
        update360Image(0);
      } else {
        firstImg.onload = () => {
          preloadedImages.current.set(images360[0], firstImg);
          update360Image(0);
        };
        firstImg.src = images360[0];
      }

      firstImg.onload = () => {
        update360Image(0);

        if (!isDragging) {
          setRotationSpeed(1.5);
          setIsAutoRotating(true);
        }
      };
      firstImg.src = images360[0];
    } else if (is360Mode && imageRef.current) {
      // Switch back to gallery mode
      imageRef.current.src = images[indexImage];
    }
  };

  const handle360Start = useCallback(
    (e) => {
      if (!is360Mode || !has360Images) return;

      e.preventDefault();
      setIsDragging(true);
      setIsAutoRotating(false);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const clientX =
        e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      setDragStart({
        x: clientX,
        angle: currentAngle,
      });
      setLastMouseX(clientX); // Set reference point
      setLastDragTime(Date.now());
      dragDirection.current = 0; // Reset direction

      if (divRef.current) {
        divRef.current.style.cursor = "grabbing";
      }
    },
    [is360Mode, has360Images, currentAngle]
  );

  // Optimized drag handler with better performance
  const handle360Move = useCallback(
    (e) => {
      if (!is360Mode || !isDragging || !has360Images) return;

      const now = performance.now(); // Dùng performance.now() cho accuracy cao hơn
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const deltaMouse = clientX - lastMouseX;
      const timeDelta = now - lastDragTime;

      // Skip update nếu movement quá nhỏ
      if (Math.abs(deltaMouse) < 1) return;

      // Xác định hướng
      if (Math.abs(deltaMouse) > 1) {
        dragDirection.current = deltaMouse > 0 ? 1 : -1;
      }

      const sensitivity = 1.2;
      const deltaX = clientX - dragStart.x;
      let newAngle = dragStart.angle - deltaX * sensitivity;
      newAngle = ((newAngle % 360) + 360) % 360;

      setCurrentAngle(newAngle);

      // Throttled image update
      throttledImageUpdate(newAngle);

      // Tính speed cho momentum
      if (timeDelta > 0) {
        const speed = (deltaMouse / timeDelta) * 8; // Giảm multiplier cho smooth hơn
        setRotationSpeed(Math.max(-6, Math.min(6, speed))); // Giảm max speed
      }

      setLastMouseX(clientX);
      setLastDragTime(now);
    },
    [
      is360Mode,
      isDragging,
      has360Images,
      dragStart,
      lastMouseX,
      lastDragTime,
      throttledImageUpdate,
    ]
  );

  const handle360End = useCallback(() => {
    if (!is360Mode || !has360Images) return;

    setIsDragging(false);

    if (divRef.current) {
      divRef.current.style.cursor = "grab";
    }

    console.log("Drag direction:", dragDirection.current); // Debug
    console.log("Final rotationSpeed:", rotationSpeed); // Debug

    if (Math.abs(rotationSpeed) > 0.5) {
      setIsAutoRotating(true);
    } else {
      setTimeout(() => {
        // Sử dụng hướng drag cuối cùng
        const finalDirection = dragDirection.current || 1; // Mặc định phải nếu không có direction
        setRotationSpeed(finalDirection * 1.5);
        setIsAutoRotating(true);
      }, 500);
    }
  }, [is360Mode, has360Images, rotationSpeed]);

  // Start auto rotation on 360 mode activation
  const startAutoRotation = () => {
    if (!is360Mode) return;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsDragging(false);
    setRotationSpeed(isAutoRotating ? 0 : 2);
    setIsAutoRotating(!isAutoRotating);
  };

  // Image zoom functionality (only in normal mode)
  useEffect(() => {
    if (is360Mode || !divRef.current) return;

    function imageZoom(container, imageElement) {
      const imgEl = container.querySelector(imageElement);
      let zoom, preview, zoomWidth, zoomHeight, widthRatio, heightRatio;
      let minZoomSize = 50;
      let maxZoomSize = 200;
      let currentZoomSize = 100;
      let scale = 10;
      let isShow = false;
      let actualImageBounds = { width: 0, height: 0, left: 0, top: 0 };

      const PREVIEW_SIZE = 300;

      const handleWheel = (e) => {
        e.preventDefault();
        const isZoomOut = e.deltaY > 0;
        changeZoomSize(isZoomOut);
        setPreview();
        update(e);
      };

      const handleMouseLeave = () => {
        hidePreview();
      };

      function calculateActualImageBounds() {
        if (!imgEl || !imgEl.naturalWidth || !imgEl.naturalHeight) return;

        const containerWidth = FIXED_CONTAINER_WIDTH;
        const containerHeight = FIXED_CONTAINER_HEIGHT;
        const imageAspectRatio = imgEl.naturalWidth / imgEl.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        if (imageAspectRatio > containerAspectRatio) {
          actualImageBounds.width = containerWidth;
          actualImageBounds.height = containerWidth / imageAspectRatio;
          actualImageBounds.left = 0;
          actualImageBounds.top =
            (containerHeight - actualImageBounds.height) / 2;
        } else {
          actualImageBounds.height = containerHeight;
          actualImageBounds.width = containerHeight * imageAspectRatio;
          actualImageBounds.top = 0;
          actualImageBounds.left =
            (containerWidth - actualImageBounds.width) / 2;
        }
      }

      function update(event) {
        calculateActualImageBounds();
        showPreview();

        const rect = container.getBoundingClientRect();
        const cursorPos = getCursorPos(event, rect);

        const isInImageBounds =
          cursorPos.x >= actualImageBounds.left &&
          cursorPos.x <= actualImageBounds.left + actualImageBounds.width &&
          cursorPos.y >= actualImageBounds.top &&
          cursorPos.y <= actualImageBounds.top + actualImageBounds.height;

        if (!isInImageBounds) {
          hidePreview();
          return;
        }

        let left = cursorPos.x - zoomWidth / 2;
        let top = cursorPos.y - zoomHeight / 2;

        if (left < actualImageBounds.left) left = actualImageBounds.left;
        if (top < actualImageBounds.top) top = actualImageBounds.top;
        if (
          left + zoomWidth >
          actualImageBounds.left + actualImageBounds.width
        ) {
          left = actualImageBounds.left + actualImageBounds.width - zoomWidth;
        }
        if (
          top + zoomHeight >
          actualImageBounds.top + actualImageBounds.height
        ) {
          top = actualImageBounds.top + actualImageBounds.height - zoomHeight;
        }

        zoom.style.left = left + "px";
        zoom.style.top = top + "px";

        const relativeLeft = left - actualImageBounds.left;
        const relativeTop = top - actualImageBounds.top;

        const bgLeft =
          (relativeLeft / actualImageBounds.width) *
          (actualImageBounds.width * widthRatio);
        const bgTop =
          (relativeTop / actualImageBounds.height) *
          (actualImageBounds.height * heightRatio);

        preview.style.backgroundPosition = `-${bgLeft}px -${bgTop}px`;
      }

      function showPreview() {
        if (!isShow) {
          isShow = true;
          const containerRect = container.getBoundingClientRect();

          preview = document.createElement("div");
          Object.assign(preview.style, {
            border: "2px solid #3b82f6",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            position: "fixed",
            top: containerRect.top + "px",
            width: PREVIEW_SIZE + "px",
            height: PREVIEW_SIZE + "px",
            backgroundColor: "#ffffff",
            left: containerRect.left + containerRect.width + 20 + "px",
            borderRadius: "12px",
            zIndex: "1000",
            pointerEvents: "none",
          });

          zoom = document.createElement("div");
          Object.assign(zoom.style, {
            border: "2px solid #3b82f6",
            width: currentZoomSize + "px",
            height: currentZoomSize + "px",
            position: "absolute",
            cursor: "crosshair",
            zIndex: "10",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "6px",
            pointerEvents: "none",
          });

          container.appendChild(zoom);
          document.body.appendChild(preview);

          zoomWidth = currentZoomSize;
          zoomHeight = currentZoomSize;
          setPreview();
        }
      }

      function hidePreview() {
        if (isShow) {
          isShow = false;
          if (zoom) zoom.remove();
          if (preview) preview.remove();
        }
      }

      function changeZoomSize(isZoomOut) {
        if (isZoomOut) {
          currentZoomSize = Math.max(
            minZoomSize,
            currentZoomSize - (currentZoomSize / 100) * scale
          );
        } else {
          currentZoomSize = Math.min(
            maxZoomSize,
            currentZoomSize + (currentZoomSize / 100) * scale
          );
        }

        zoomWidth = currentZoomSize;
        zoomHeight = currentZoomSize;

        if (zoom) {
          zoom.style.width = zoomWidth + "px";
          zoom.style.height = zoomHeight + "px";
        }
      }

      function setPreview() {
        if (!preview || !imgEl) return;

        calculateActualImageBounds();

        widthRatio = PREVIEW_SIZE / zoomWidth;
        heightRatio = PREVIEW_SIZE / zoomHeight;

        preview.style.backgroundImage = `url(${imgEl.src})`;
        preview.style.backgroundColor = "white";

        const bgWidth = actualImageBounds.width * widthRatio;
        const bgHeight = actualImageBounds.height * heightRatio;

        preview.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
        preview.style.backgroundRepeat = "no-repeat";
      }

      function getCursorPos(e, rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        return {
          x: Math.max(0, Math.min(FIXED_CONTAINER_WIDTH, x)),
          y: Math.max(0, Math.min(FIXED_CONTAINER_HEIGHT, y)),
        };
      }

      const handleImageLoad = () => {
        calculateActualImageBounds();
      };

      if (imgEl?.complete) {
        handleImageLoad();
      } else {
        imgEl?.addEventListener("load", handleImageLoad);
      }

      container.addEventListener("mousemove", update);
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", update);
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("mouseleave", handleMouseLeave);
        imgEl?.removeEventListener("load", handleImageLoad);
        hidePreview();
      };
    }

    const cleanup = imageZoom(divRef.current, "img");
    return cleanup;
  }, [indexImage, is360Mode]);

  useEffect(() => {
    if (!divRef.current || !is360Mode) return;

    const element = divRef.current;

    // Add passive listeners for better performance
    const options = { passive: false };

    element.addEventListener("touchstart", handle360Start, options);
    element.addEventListener("touchmove", handle360Move, { passive: true });
    element.addEventListener("touchend", handle360End, options);

    return () => {
      element.removeEventListener("touchstart", handle360Start);
      element.removeEventListener("touchmove", handle360Move);
      element.removeEventListener("touchend", handle360End);
    };
  }, [is360Mode, handle360Start, handle360Move, handle360End]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-wrap" ref={previewRef}>
      {/* Thumbnail Gallery - Hidden in 360 mode */}
      {!is360Mode && (
        <div className="flex-[0_0_110px] px-2 pt-1 max-h-[500px] overflow-hidden">
          <div className="flex flex-col gap-3" ref={thumbRef}>
            {images?.map((item, index) => {
              return (
                <div
                  className={`relative w-[100px] h-[100px] shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                    indexImage === index
                      ? "ring-3 ring-blue-500 ring-offset-2 shadow-lg scale-105"
                      : "ring-2 ring-gray-200 hover:ring-gray-300 opacity-70 hover:opacity-90"
                  }`}
                  key={index}
                  onClick={() => handleChangeIndex(index)}
                >
                  <ImageCustom
                    src={showImageUrl(item)}
                    alt={productCurrent?.name}
                    width={0}
                    height={0}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {indexImage === index && (
                    <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-xl"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative group">
          {/* Fixed Size Image Container */}
          <div
            className={`relative bg-white border-2 border-gray-200/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${
              is360Mode
                ? "cursor-grab active:cursor-grabbing border-blue-500/50"
                : ""
            }`}
            style={{
              width: `${FIXED_CONTAINER_WIDTH}px`,
              height: `${FIXED_CONTAINER_HEIGHT}px`,
            }}
            ref={divRef}
            onMouseDown={handle360Start}
            onMouseMove={handle360Move}
            onMouseUp={handle360End}
            onMouseLeave={handle360End}
            onTouchStart={handle360Start}
            onTouchMove={handle360Move}
            onTouchEnd={handle360End}
          >
            <ImageCustom
              ref={imageRef}
              width={0}
              height={0}
              src={showImageUrl(
                is360Mode && has360Images ? images360[0] : images[indexImage]
              )}
              alt={`${productCurrent?.name}`}
              className="w-full h-full object-contain transition-transform duration-200"
              draggable={false}
            />

            {/* Loading indicator for 360 mode */}
            {is360Mode && isPreloading && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-700">Loading 360°...</span>
                </div>
              </div>
            )}

            {/* Gradient Overlays for Better Button Visibility */}
            {!is360Mode && (
              <>
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </>
            )}
          </div>

          {/* Navigation Buttons - Hidden in 360 mode */}
          {!is360Mode && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-blue-500 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                onClick={() => handleChangeIndex(indexImage - 1)}
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-blue-500 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                onClick={() => handleChangeIndex(indexImage + 1)}
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* 360 Mode Toggle Button */}
          {has360Images && (
            <button
              className={`absolute top-4 left-4 w-12 h-12 backdrop-blur-sm border-2 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-20 ${
                is360Mode
                  ? "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white opacity-100"
                  : "bg-white/90 hover:bg-white border-gray-200 hover:border-blue-500 text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100"
              }`}
              onClick={toggle360Mode}
              aria-label={is360Mode ? "Exit 360 view" : "Enter 360 view"}
              disabled={is360Mode && isPreloading}
            >
              {is360Mode ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Auto Rotate Button - Only in 360 mode */}
          {is360Mode && has360Images && (
            <button
              className={`absolute top-4 right-4 w-12 h-12 backdrop-blur-sm border-2 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-20 ${
                isAutoRotating
                  ? "bg-green-600 hover:bg-green-700 border-green-600 text-white"
                  : "bg-white/90 hover:bg-white border-gray-200 hover:border-green-500 text-gray-600 hover:text-green-600"
              }`}
              onClick={startAutoRotation}
              aria-label={
                isAutoRotating ? "Stop auto rotation" : "Start auto rotation"
              }
            >
              {isAutoRotating ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-6.219-8.56"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {is360Mode ? (
              <span>360° View - Drag to rotate</span>
            ) : (
              <span>
                {indexImage + 1} / {images.length}
              </span>
            )}
          </div>

          {/* Zoom Instructions - Only in normal mode */}
          {!is360Mode && (
            <div className="absolute bottom-4 right-4 px-3 py-2 bg-black/70 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Scroll to zoom</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
