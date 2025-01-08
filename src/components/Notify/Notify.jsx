"use client";
import { NotifyContext } from "@/context/NotifyProvider";
import React, { useContext, useEffect, useRef, useState } from "react";

const NotifyComponent = () => {
  const { showNotify, setShowNotify, dataNotify, timeout } =
    useContext(NotifyContext);
  const timerRef = useRef(null);
  useEffect(() => {
    startHiddenNotify()
    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotify]);

  const handleNotify = () => {
    switch (dataNotify.type) {
      case "success":
        return "border-green-500 border";
      case "error":
        return "border-red-500 border";
      default:
        return "border";
    }
  };

  const stopHiddenNotify = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }

  const startHiddenNotify = () => {
    timerRef.current = setTimeout(() => {
      setShowNotify(false);
    }, timeout);
  }


  return (
    <div
      className={`fixed top-2 z-[9999] right-2 ${
        showNotify ? "z-[1000]" : "invisible"
      } transition-all duration-300 overflow-hidden`}
    >
      <div
        onClick={() => setShowNotify(false)}
        onMouseMove={stopHiddenNotify}
        onMouseLeave={startHiddenNotify}
        className={`p-4 bg-white border rounded-lg transition-all duration-300 ${
          showNotify ? "translate-y-0" : "translate-y-[-100%]"
        }`}
      >
        {dataNotify.message}
        <div className={`progress ${handleNotify()}`}></div>
      </div>
    </div>
  );
};

export default NotifyComponent;
