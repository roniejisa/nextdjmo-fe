import LinkCustom from "@/packages/translation/Link";
import React from "react";
import RightMenu from "./RightMenu";
import { showImageUrl } from "@/utils/client/util";
import { httpClient } from "@/utils/http";
import ImageCustom from "@/components/Maintain/Image";
import HeaderClient from "@/components/Header/HeaderClient";

export const getLogo = async () => {
  try {
    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-setting/logo"
    );
    return response;
  } catch (e) {
    return {};
  }
};

const getMenuHeader = async () => {
  try {
    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-menu/header"
    );
    return response.data;
  } catch (e) {
    return [];
  }
};
const Header = async () => {
  const logo = await getLogo();
  const leftMenus = await getMenuHeader();
  return (
    <HeaderClient className="relative flex justify-between h-[100px] transition bg-active-light">
      <div className="lg:hidden flex items-center pl-4 flex-[0_0_calc(100%/3)]">
        <label className="cursor-pointer py-2 pr-2" htmlFor="show-menu">
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
            className="w-6 h-6"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 6h10" />
            <path d="M4 12h16" />
            <path d="M7 12h13" />
            <path d="M4 18h10" />
          </svg>
        </label>
        <label
          className="overlay fixed -right-full top-0 bottom-0 w-1/3 opacity-30 z-[9999] cursor-pointer"
          htmlFor="show-menu"
        ></label>
      </div>
      <LinkCustom
        href={"/"}
        className="flex-[0_0_calc(100%/3)] flex justify-center lg:justify-start lg:flex-[0_0_calc(100%/12*2)] lg:pl-10 outline-none select-none"
      >
        <ImageCustom
          src={showImageUrl(logo?.data)}
          width={100}
          height={40}
          className="object-contain h-full p-2"
          alt="Trang chủ"
        />
      </LinkCustom>

      <input type="checkbox" id="show-menu" hidden />
      <ul className="lg:flex z-[9999] lg:bg-transparent w-2/3 lg:w-full border-r lg:border-r-0 lg:px-0 h-screen lg:h-auto -left-full justify-center items-center flex-1 fixed lg:static">
        <li className="border-b lg:hidden">
          <LinkCustom href={"/"} className="h-20 block">
            <ImageCustom
              src={showImageUrl(logo?.data)}
              width={100}
              height={40}
              className="object-contain h-full px-4 py-2"
              alt="Trang chủ"
            />
          </LinkCustom>
        </li>
        {leftMenus.map((menu, index) => (
          <li
            key={index}
            className="group px-4 border-b lg:border-b-0 lg:bg-transparent"
          >
            {!menu.childs ? (
              <LinkCustom
                href={menu.link}
                className="py-2 lg:mr-10 block font-medium text-xl"
              >
                {menu.name}
              </LinkCustom>
            ) : (
              <>
                <div>
                  <span className="py-2 block lg:mr-10 font-medium text-xl">
                    {menu.name}
                  </span>
                </div>
                <div className="lg:absolute delay-500 transition-all duration-300 group-hover:delay-0 pl-6 lg:px-10 lg:py-4 w-full left-0 top-full lg:opacity-0 lg:invisible lg:group-hover:visible group-hover:opacity-100 lg:bg-white lg:before:content-[''] max-h-[100vh] lg:min-h-[150px] z-10">
                  {menu.childs.map((subMenu, indexSub) => (
                    <ul key={indexSub}>
                      <li>
                        <LinkCustom
                          className="py-2 inline-block"
                          href={"/" + subMenu.link}
                        >
                          {subMenu.name}
                        </LinkCustom>
                      </li>
                    </ul>
                  ))}
                </div>
              </>
            )}
          </li>
        ))}
        <label htmlFor="show-menu" className="absolute top-4 right-4 lg:hidden">
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
            className="w-6 h-6"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </label>
      </ul>
      <div className="flex-[0_0_calc(100%/3)] lg:flex-[0_0_calc(100%/12*2)] flex items-center justify-end">
        <RightMenu />
      </div>
    </HeaderClient>
  );
};

export default Header;
