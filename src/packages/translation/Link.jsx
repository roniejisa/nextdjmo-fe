"use client";

import Link from "next/link";
import useRouterCustom from "./Navigation";
import { useContext } from "react";
import { LoadingContext } from "./LoadingProvider";

const LinkCustom = ({ children, href, isRefresh = true, ...props }) => {
  const router = useRouterCustom();
  const { currentPathname } = useContext(LoadingContext);
  const changePage = (e) => {
    e.preventDefault();
    if (currentPathname === href) return;
    router.push(href, isRefresh);
  };
  return (
    <Link href={href} onClick={changePage} {...props}>
      {children}
    </Link>
  );
};

export default LinkCustom;
