"use client";

import ImageCustom from "@/components/Maintain/Image";
import LinkCustom from "@/packages/translation/Link";
import { showImageUrl } from "@/utils/client/util";
import { useEffect, useRef } from "react";

const Slide = ({ items }) => {
  const indexRef = useRef(0);
  const slideRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = indexRef.current + 1;
      if (indexRef.current > items.length - 1) {
        indexRef.current = 0;
      }
      const widthInner = window.innerWidth;
      slideRef.current.style.transform = `translateX(-${
        indexRef.current * widthInner
      }px)`;
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-screen overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        ref={slideRef}
        style={{
          width: `${items.length * 100}vw`,
        }}
      >
        {items.map((item) => {
          const url = showImageUrl(item.image);
          return (
            <div
              key={item._id}
              className="w-full flex-shrink-0 h-screen relative"
              style={{
                width: "100vw",
              }}
            >
              <ImageCustom src={showImageUrl(item.image)} fill={true} className="object-cover"/>
              <div className="w-full h-full flex items-center justify-center ">
                <div className="absolute bottom-10 left-10 z-[100]">
                  <p className="text-white text-7xl mb-6 relative">
                    {item.name}
                  </p>
                  <p className="text-white text-2xl relative">
                    {item.description}
                  </p>
                  <LinkCustom
                    href={item.title}
                    className="text-white min-w-[200px]  p-4 relative border-2 mt-8 inline-flex justify-center font-bold"
                  >
                    {item.title}
                  </LinkCustom>
                </div>
              </div>
              <div className="absolute top-0 z-0 left-0 w-full h-screen bg-[rgba(0,0,0,.5)]"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slide;
