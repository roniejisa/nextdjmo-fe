"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { useContext, useState } from "react";
import { handleLogout } from "./action";
import { AccountContext } from "@/context/client/AccountProvider";
import LinkCustom from "@/packages/translation/Link";

const MenuProfile = ({ id }) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouterCustom();
  const clickLogout = async () => {
    try {
      await handleLogout();
    } catch (e) {}
    router.push("/");
  };

  return (
    <div className="menu relative leading-none bg-white z-10">
      <button
        onMouseOver={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
        onMouseEnter={() => setShowMenu(true)}
        className="border rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 px-2"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        </svg>
      </button>
      <div
        onMouseOver={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
        onMouseEnter={() => setShowMenu(true)}
        className={`transition-all duration-300 absolute ${
          showMenu
            ? "opacity-100 visible top-0 pointer-events-auto"
            : "opacity-0 invisible top-[-30px] pointer-events-none"
        }`}
      >
        <div className="w-4 h-4 rotate-45 absolute bg-white shadow top-[-22px] left-[13px] z-10"></div>
        <ul
          className={`absolute top-[-15px] z-20 -translate-y-full left-[-5px] before:z-0 bg-white shadow-lg min-w-[200px] rounded-lg before:content-[''] before:absolute before:w-full before:h-5 before:-bottom-4`}
        >
          <li>
            <LinkCustom href={"/"} title="Trang chủ" className="p-4 block">
              Xem trang chủ
            </LinkCustom>
          </li>
          <li className="relative bg-white rounded-full">
            <button onClick={clickLogout} className="block py-4 px-4">
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuProfile;
