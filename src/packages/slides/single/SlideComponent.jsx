"use client";

import ImageCustom from "@/components/Maintain/Image";
import { showImageUrl } from "@/utils/client/util";
import { useEffect, useRef } from "react";
import LinkCustom from "../../translation/Link";

const SlideComponent = ({ item, index }) => {
  const itemRef = useRef(null);
  useEffect(() => {
    const handleEvent = (e) => {
      if (e.detail.index === index) {
        itemRef.current.classList.remove("opacity-0", "top-[100%]");
        itemRef.current.classList.add(
          "delay-500",
          "opacity-100",
          "top-1/2",
          "translate-y-[-50%]"
        );
      } else {
        itemRef.current.classList.remove(
          "delay-500",
          "opacity-100",
          "top-1/2",
          "translate-y-[-50%]"
        );
        itemRef.current.classList.add("opacity-0");
      }
    };
    window.addEventListener("slide-change", handleEvent);
    return () => window.removeEventListener("slide-change", handleEvent);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div
        className="absolute z-[100] transition-all duration-700 left-[200px] top-[100%] opacity-0"
        ref={itemRef}
      >
        <p>{item.name}</p>
        <LinkCustom
          href={item.url}
          className="mt-5 min-w-[200px] py-4 flex justify-center items-center transition-all duration-300 border border-foreground hover:bg-foreground hover:text-background rounded-lg"
        >
          {item.title}
        </LinkCustom>
      </div>
      <ImageCustom
        src={showImageUrl(item.image)}
        fill={true}
        alt={item.name}
        className="object-cover object-top"
      />
    </>
  );
};

export default SlideComponent;
