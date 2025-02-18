"use client";
import React, { forwardRef } from "react";

const SectionItem = forwardRef(function SectionItem(
  { name, children, index, number },
  ref
) {
  const isOverlay = (number + 2) % 2 > 0;
  const checkShowTitle = () => {
    return `transition-all text-foreground flex-[0_0_25%] text-xl leading-normal lg:text-[100px] px-4 lg:sticky lg:pl-10 lg:mb-10 py-4 top-[120px] left-0 self-start duration-700 transform text-black title-shadow ${
      index === number
        ? "translate-x-0 opacity-100"
        : "-translate-x-full opacity-0"
    }`;
  };

  const checkShowContent = () => {
    return `transition-all duration-700 ${
      index === number
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0"
    }`;
  };

  return (
    <section ref={ref} className={`lg:px-4 ${isOverlay ? "relative" : ""}`}>
      {isOverlay ? (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      ) : (
        ""
      )}
      <div
        className={`lg:flex flex-wrap lg:-mx-4 h-screen ${
          isOverlay ? "" : "bg-black"
        }`}
      >
        <h3 className={checkShowTitle()}>{name}</h3>
        <div className="overflow-hidden flex-1 lg:px-4">
          <div className={checkShowContent()}>{children}</div>
        </div>
      </div>
    </section>
  );
});

export default SectionItem;
