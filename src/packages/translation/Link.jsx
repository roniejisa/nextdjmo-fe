"use client"
import Link from "next/link";
import useRouterCustom from "./Navigation";

const LinkCustom = ({ children, href, ...props }) => {
  const router = useRouterCustom();
  
  const changePage = (e) => {
    e.preventDefault();
    router.push(href);
  };
  
  return (
    <Link href={href} onClick={changePage} {...props}>
      {children}
    </Link>
  );
};

export default LinkCustom;