"use client";

import { ClientContext } from "@/context/client/ClientProvider";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";

const HeaderClient = ({ children, ...props }) => {
  const pathname = usePathname()
  const { headerRef } = useContext(ClientContext);
  useEffect(() => {
    if (!headerRef.current) return;
    if(pathname === "/"){
      headerRef.current.classList.remove("relative");
      headerRef.current.classList.add(
        "fixed",
        "top-0",
        "w-full",
        "bg-[#00000050]",
        "z-[9999]"
      );
      return

    }
    const handleScroll = () => {
      if (!headerRef.current) return;
      const scroll = window.scrollY;
      const headerHeight = headerRef.current.offsetHeight;
      if (scroll > 0) {
        document.body.style.paddingTop = `${headerHeight}px`;
        headerRef.current.classList.remove("relative");
        headerRef.current.classList.add(
          "fixed",
          "top-0",
          "w-full",
          "bg-background",
          "z-[9999]"
        );
      } else {
        document.body.style.paddingTop = "0";
        headerRef.current.classList.add("relative");
        headerRef.current.classList.remove(
          "fixed",
          "top-0",
          "w-full",
          "bg-background",
          "z-[9999]"
        );
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <header ref={headerRef} {...props}>
      {children}
    </header>
  );
};

export default HeaderClient;
