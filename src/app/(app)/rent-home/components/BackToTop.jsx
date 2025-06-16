"use client";
import { ArrowUp } from "lucide-react";
import React from "react";

const BackToTop = ({ isVisible }) => {
  return (
    <>
      {isVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowUp />
        </button>
      )}
    </>
  );
};

export default BackToTop;
