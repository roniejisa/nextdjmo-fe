"use client";
import StarFullBackground from "@/components/Icon/svg/StarFullBackground";
import StarNoBackground from "@/components/Icon/svg/StarNoBackground";
import React, { useRef } from "react";

const StarIcon = ({ percent = 0, size = "24px" }) => {
  return (
    <div className="relative flex w-fit">
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          return (
            <StarNoBackground
              key={index}
              className={`text-yellow-500`}
              style={{
                width: size,
                height: size,
              }}
            />
          );
        })}
        <div
          className="absolute flex overflow-hidden transition-all duration-300"
          style={{
            width: `${percent}%`,
          }}
        >
          {[...Array(5)].map((_, index) => {
            return (
              <StarFullBackground
                key={index}
                className={`text-yellow-500 shrink-0`}
                style={{
                  width: size,
                  height: size,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StarIcon;
