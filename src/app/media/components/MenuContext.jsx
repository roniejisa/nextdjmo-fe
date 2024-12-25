"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMedia } from "../MediaProvider";

const MenuContext = () => {
  const { menuPosition, setMenuPosition, listComponent } = useMedia((data) => data);
  const [opacityList, setOpacityList] = useState([]);
  const menuContextRef = useRef(null);
  const handleCloseContextMenu = () => {
    setMenuPosition(null);
  };

  const calculateTop = (y) => {
    const height = menuContextRef.current?.getBoundingClientRect()?.height ?? 0;
    // Kiểm tra nếu kích thước lớn hơn và vượt ra ngoài thì phải sửa lại
    const windowHeight = window.innerHeight;
    if (y + height > windowHeight) {
      return y - height;
    }
    return y;
  };

  const calculatorLeft = (x) => {
    const width = menuContextRef.current?.getBoundingClientRect()?.width ?? 0;
    // Kiểm tra nếu kích thước lớn hơn và vượt ra ngoài thì phải sửa lại
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
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
            listStyle: "none",
            padding: "10px",
            opacity: opacityList,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            transformOrigin: "top left",
          }}
        >
          {listComponent.map(({text, attribute}, index) => (
            <li key={index} style={{ cursor: "pointer" }} {...attribute}>
              {text}
            </li>
          ))}
        </ul>
      )}

      <style>
        {`
            .show{
              opacity: 1;
              animation: scale-up 0.3s ease-out;
            }
          @keyframes scale-up {
            0% {
              transform: scale(0);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default MenuContext;
