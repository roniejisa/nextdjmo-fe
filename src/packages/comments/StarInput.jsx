"use client";
import StarFullBackground from "@/components/Icon/svg/StarFullBackground";
import StarNoBackground from "@/components/Icon/svg/StarNoBackground";
import React, { useRef } from "react";

const StarInput = ({ size = "24px" }) => {
  const starRef = useRef({});
  const starPreviewRef = useRef(null);
  const handleCheckSelected = (e) => {
    const valueCheckedCurrent = e.target.value;
    const checked = e.target.checked;
    for (const [_, { el, value }] of Object.entries(starRef.current)) {
      if (!checked) {
        starPreviewRef.current.style.width = `0%`;
        return;
      }
      if (el.value == valueCheckedCurrent) {
        el.checked = true;
        starPreviewRef.current.style.width = `${value * 20}%`;
      } else {
        el.checked = false;
      }
    }
  };
  return (
    <div className="relative flex w-fit">
      <div className="flex">
        <label className="cursor-pointer">
          <StarNoBackground
            className="text-yellow-500"
            style={{ width: size, height: size }}
          />
          <input
            type="checkbox"
            onClick={handleCheckSelected}
            className="cursor-pointer"
            id="one"
            name="star"
            hidden
            value={1}
            ref={(el) => {
              starRef.current["one"] = {
                el,
                value: 1,
              };
            }}
          />
        </label>
        <label className="cursor-pointer">
          <StarNoBackground
            className="text-yellow-500"
            style={{ width: size, height: size }}
          />
          <input
            type="checkbox"
            onClick={handleCheckSelected}
            className="cursor-pointer"
            id="two"
            name="star"
            hidden
            value={2}
            ref={(el) => {
              starRef.current["two"] = {
                el,
                value: 2,
              };
            }}
          />
        </label>
        <label className="cursor-pointer">
          <StarNoBackground
            className="text-yellow-500"
            style={{ width: size, height: size }}
          />
          <input
            type="checkbox"
            onClick={handleCheckSelected}
            className="cursor-pointer"
            id="three"
            name="star"
            hidden
            value={3}
            ref={(el) => {
              starRef.current["three"] = {
                el,
                value: 3,
              };
            }}
          />
        </label>
        <label className="cursor-pointer">
          <StarNoBackground
            className="text-yellow-500"
            style={{ width: size, height: size }}
          />
          <input
            type="checkbox"
            onClick={handleCheckSelected}
            className="cursor-pointer"
            name="star"
            id="four"
            hidden
            value={4}
            ref={(el) => {
              starRef.current["four"] = {
                el,
                value: 4,
              };
            }}
          />
        </label>
        <label className="cursor-pointer">
          <StarNoBackground
            className="text-yellow-500"
            style={{ width: size, height: size }}
          />
          <input
            type="checkbox"
            onClick={handleCheckSelected}
            className="cursor-pointer"
            name="star"
            id="five"
            hidden
            value={5}
            ref={(el) => {
              starRef.current["five"] = {
                el,
                value: 5,
              };
            }}
          />
        </label>
      </div>
      <div
        className="absolute flex overflow-hidden transition-all duration-300"
        style={{
          width: "0%",
        }}
        ref={starPreviewRef}
      >
        <label className="cursor-pointer shrink-0" htmlFor="one">
          <StarFullBackground
            className="text-yellow-500"
            style={{
              width: size,
              height: size,
            }}
          />
        </label>
        <label className="cursor-pointer shrink-0" htmlFor="two">
          <StarFullBackground
            className="text-yellow-500"
            style={{
              width: size,
              height: size,
            }}
          />
        </label>
        <label className="cursor-pointer shrink-0" htmlFor="three">
          <StarFullBackground
            className="text-yellow-500"
            style={{
              width: size,
              height: size,
            }}
          />
        </label>
        <label className="cursor-pointer shrink-0" htmlFor="four">
          <StarFullBackground
            className="text-yellow-500"
            style={{
              width: size,
              height: size,
            }}
          />
        </label>
        <label className="cursor-pointer shrink-0" htmlFor="five">
          <StarFullBackground
            className="text-yellow-500"
            style={{
              width: size,
              height: size,
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default StarInput;
