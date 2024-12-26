import LinkCustom from "@/packages/translation/Link";
import React from "react";
import RightMenu from "./RightMenu";
import Image from "next/image";
import { showImageUrl } from "@/utils/client/util";
import { httpClient } from "@/utils/http";

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
    <header className="relative flex justify-between border-b h-[100px]">
      <ul className="flex items-center flex-[0_0_33.333333%] pl-10">
        {leftMenus.map((menu, index) => (
          <li key={index} className="group">
            {!menu.childs ? (
              <LinkCustom href={menu.link} className="py-2 mr-10 block">
                {menu.name}
              </LinkCustom>
            ) : (
              <>
                <span className="py-2 block mr-10">{menu.name}</span>
                <div className="absolute px-10 py-4 w-full left-0 top-[calc(100%+1px)] opacity-0 invisible group-hover:visible group-hover:opacity-100 bg-[#00000080] before:content-[''] before:absolute before:top-[-35px] before:w-[200px] before:h-[50px] before:bg-transparent max-h-[100vh] min-h-[150px] z-10">
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
      </ul>
      <LinkCustom
        href={"/"}
        className="flex-[0_0_33.333333%] flex items-center justify-center"
      >
        <Image
          src={showImageUrl(logo?.data)}
          width={100}
          height={40}
          className="object-contain h-full p-2"
          alt="Trang chủ"
        />
      </LinkCustom>
      <div className="flex-[0_0_33.333333%] flex items-center justify-end">
        <RightMenu />
      </div>
    </header>
  );
};

export default Header;
