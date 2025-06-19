"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMediaStore } from "@/stories/files/mediaStore";

const MenuContext = () => {
  const menuPosition = useMediaStore((state) => state.menuPosition);
  const listComponent = useMediaStore((state) => state.listComponent);
  const setMenuPosition = useMediaStore((state) => state.setMenuPosition);
  const [opacityList, setOpacityList] = useState([]);
  const menuContextRef = useRef(null);

  const handleCloseContextMenu = () => {
    setMenuPosition(null);
  };

  const calculateTop = (y) => {
    const height = menuContextRef.current?.getBoundingClientRect()?.height ?? 0;
    const windowHeight = window.innerHeight;
    if (y + height > windowHeight) {
      return y - height;
    }
    return y;
  };

  const calculatorLeft = (x) => {
    const width = menuContextRef.current?.getBoundingClientRect()?.width ?? 0;
    const windowWidth = window.innerWidth;
    if (x + width > windowWidth) {
      menuContextRef.current.style.transformOrigin = "top right";
      return x - width;
    }
    return x;
  };

  useEffect(() => {
    if (menuContextRef.current) {
      menuContextRef.current.classList.remove("show");
      if (menuPosition) {
        setOpacityList(1);
        menuContextRef.current.classList.add("show");
      } else {
        setOpacityList(0);
      }
    }
  }, [menuPosition]);

  return (
    <div>
      {menuPosition && (
        <ul
          ref={menuContextRef}
          onClick={handleCloseContextMenu}
          style={{
            position: "fixed",
            top: `${calculateTop(menuPosition.y)}px`,
            left: `${calculatorLeft(menuPosition.x)}px`,
            listStyle: "none",
            padding: "0",
            margin: "0",
            minWidth: "180px",
            opacity: opacityList,
            zIndex: 1000,
            transformOrigin: "top left",
          }}
          className="menu-context-glass"
        >
          {/* Glass container with backdrop blur */}
          <div className="glass-container">
            {/* Inner content container */}
            <div className="menu-content">
              {listComponent.map(({ text, attribute }, index) => (
                <li key={index} className="menu-item" {...attribute}>
                  <span className="menu-text">{text}</span>
                  {/* Hover overlay */}
                  <div className="hover-overlay"></div>
                </li>
              ))}
            </div>

            {/* Glossy overlay effect */}
            <div className="glossy-overlay"></div>

            {/* Subtle inner border */}
            <div className="inner-border"></div>
          </div>
        </ul>
      )}
    </div>
  );
};

export default MenuContext;
