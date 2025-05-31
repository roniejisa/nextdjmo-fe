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

  const getNotifyStyles = () => {
    switch (dataNotify.type) {
      case "success":
        return {
          bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
          borderColor: "border-emerald-300/50",
          textColor: "text-emerald-800",
          iconColor: "text-emerald-500",
          progressBg: "bg-emerald-500",
          shadowColor: "shadow-emerald-100"
        };
      case "error":
        return {
          bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
          borderColor: "border-red-300/50",
          textColor: "text-red-800",
          iconColor: "text-red-500",
          progressBg: "bg-red-500",
          shadowColor: "shadow-red-100"
        };
      default:
        return {
          bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
          borderColor: "border-blue-300/50",
          textColor: "text-blue-800",
          iconColor: "text-blue-500",
          progressBg: "bg-blue-500",
          shadowColor: "shadow-blue-100"
        };
    }
  };

  const getIcon = () => {
    const styles = getNotifyStyles();
    switch (dataNotify.type) {
      case "success":
        return (
          <svg className={`w-5 h-5 ${styles.iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "error":
        return (
          <svg className={`w-5 h-5 ${styles.iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={`w-5 h-5 ${styles.iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
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

  const styles = getNotifyStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] max-w-sm w-full sm:w-auto transition-all duration-500 ease-in-out transform ${
        showNotify 
          ? "translate-y-0 opacity-100 scale-100" 
          : "-translate-y-2 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div
        onClick={() => setShowNotify(false)}
        onMouseEnter={stopHiddenNotify}
        onMouseLeave={startHiddenNotify}
        className={`
          relative overflow-hidden
          ${styles.bgColor} ${styles.borderColor} ${styles.shadowColor}
          backdrop-blur-sm
          border rounded-xl shadow-lg shadow-black/5
          transition-all duration-300
          hover:shadow-xl hover:shadow-black/10
          cursor-pointer group
          min-w-[320px] sm:min-w-[360px]
        `}
      >
        {/* Main Content */}
        <div className="flex items-start gap-3 p-4 pr-12">
          {/* Icon */}
          <div className="mt-0.5">
            {getIcon()}
          </div>
          
          {/* Message */}
          <div className={`flex-1 ${styles.textColor}`}>
            <p className="text-sm font-medium leading-relaxed">
              {dataNotify.message}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowNotify(false)}
          className={`
            absolute top-3 right-3 p-1.5 rounded-lg
            ${styles.iconColor} hover:bg-white/50
            transition-all duration-200
            opacity-70 hover:opacity-100
            group-hover:scale-110 transform
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className={`h-full ${styles.progressBg} transition-all duration-300 animate-pulse progress ${handleNotify()}`}
            style={{
              animation: `shrink ${timeout}ms linear forwards`
            }}
          ></div>
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotifyComponent;