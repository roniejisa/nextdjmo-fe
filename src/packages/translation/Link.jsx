"use client";

import Link from "next/link";
import useRouterCustom from "./Navigation";
import { useContext } from "react";
import { LoadingContext } from "./LoadingProvider";

const LinkCustom = ({ children, href, ...props }) => {
  const router = useRouterCustom();
  const { currentPathname, searchParamString} = useContext(LoadingContext);
  const changePage = (e) => {
    e.preventDefault();
    if(currentPathname + searchParamString != href.replace("?","")) router.replace(href);
  };
  return (
    <Link href={href} onClick={changePage} {...props}>
      {children}
    </Link>
  );
};

export default LinkCustom;
