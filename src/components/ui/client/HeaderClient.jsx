"use client";

import { useEffect, useState } from "react";

const HeaderClient = ({ children, ...props }) => {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScrollTop = (e) => {
      const scrollHeight = window.scrollY;
      if (scrollHeight > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScrollTop);
    return () => {
      window.removeEventListener("scroll", handleScrollTop);
    };
  }, []);
  return (
    <header
      {...props}
      style={
        isSticky
          ? {
              backgroundColor: "black",
              paddingTop: "16px",
              paddingBottom: "16px",
            }
          : {}
      }
    >
      {children}
    </header>
  );
};

export default HeaderClient;
