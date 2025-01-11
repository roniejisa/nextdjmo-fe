"use client";

import { ClientContext } from "@/context/client/ClientProvider";
import { useContext, useEffect } from "react";

const HeaderClient = ({ children, ...props }) => {
  const { headerRef } = useContext(ClientContext);
  useEffect(() => {
    if (!headerRef.current) return;
    const handleScroll = () => {
      const scroll = window.scrollY;
      const headerHeight = headerRef.current.offsetHeight;
      if (scroll > 0) {
        document.body.style.paddingTop = `${headerHeight}px`;
        headerRef.current.classList.remove("relative", "bg-black");
        headerRef.current.classList.add(
          "fixed",
          "top-0",
          "w-full",
          "z-[9999]",
          "bg-[#00000050]"
        );
      } else {
        document.body.style.paddingTop = "0";
        headerRef.current.classList.add("relative", "bg-black");
        headerRef.current.classList.remove(
          "fixed",
          "top-0",
          "bg-[#000]",
          "w-full",
          "z-[9999]"
        );
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header ref={headerRef} {...props}>
      {children}
    </header>
  );
};

export default HeaderClient;
