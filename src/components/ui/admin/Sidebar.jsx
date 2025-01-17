"use client";
import LinkCustom from "@/packages/translation/Link";
import { usePathname } from "next/navigation";
import SidebarProfile from "./SidebarProfile";
import useRouterCustom from "@/packages/translation/Navigation";
import React from "react";
import { iconSVG } from "@/components/Icon/svg/constants";
import { allMenu } from "./constants/AllMenu";
const IconKnow = () => {
  return <></>;
};
const Sidebar = ({ profile }) => {
  const router = useRouterCustom();
  const pathname = usePathname();
  if (!profile) {
    return <></>;
  }
  const checkActiveMenu = (link, hasChild = false) => {
    if (link === "") {
      if (pathname === process.env.NEXT_PUBLIC_ADMIN_URL.slice(0, -1) + link) {
        return "text-outline font-medium";
      }
      return "";
    }
    const listLink = link.split("|");
    if (
      listLink.some((link) => {
        return pathname.startsWith(process.env.NEXT_PUBLIC_ADMIN_URL + link);
      })
    ) {
      return hasChild
        ? "bg-[#2a85ff1a] text-outline rounded-md active font-medium"
        : "text-outline rounded-md font-medium";
    } else {
      return "";
    }
  };

  const checkActiveMenuChild = (link) => {
    if (pathname.startsWith(process.env.NEXT_PUBLIC_ADMIN_URL + link)) {
      return "before:bg-outline";
    } else {
      return "before:bg-gray-200";
    }
  };
  if (!profile || !profile.permissions) return router.push("/");
  const { permissions } = profile;
  return (
    <aside className="invisible fixed lg:relative lg:visible w-[280px] shadow-lg h-screen lg:h-[calc(100vh-16px*2)] rounded-none lg:rounded-2xl bg-main flex-col pt-4">
      <ul className="flex-1 h-[calc(100vh-16px*2-16px*2-56px)]  overflow-auto">
        {allMenu
          .filter((item) => {
            const lists = item.link.split("|");
            return (
              lists.some((item) => permissions.includes(`${item}.read`)) ||
              item.link == ""
            );
          })
          .map((item) => {
            const IconComponent =
              typeof iconSVG === "object" && item.icon && iconSVG[item.icon]
                ? iconSVG[item.icon]
                : IconKnow;
            return (
              <React.Fragment key={item.id}>
                {item.items ? (
                  <li className={`flex justify-between items-center mx-2`}>
                    <div className="w-full menu-sidebar">
                      <label
                        className={`flex justify-between items-center w-full px-4 py-2 cursor-pointer hover:bg-active-light hover:text-outline transition ${checkActiveMenu(
                          item.link,
                          true
                        )}`}
                        htmlFor={`menu-sidebar-${item.id}`}
                      >
                        <span className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5" />
                          {item.name}
                        </span>
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
                          className="transition w-4 h-4 text-current"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M6 9l6 6l6 -6" />
                        </svg>
                      </label>
                      <ul className="menu-sub">
                        <input
                          type="checkbox"
                          id={`menu-sidebar-${item.id}`}
                          defaultChecked={item.link
                            .split("|")
                            .some(
                              (link) =>
                                process.env.NEXT_PUBLIC_ADMIN_URL + link ==
                                pathname
                            )}
                          hidden
                        />
                        {item.items
                          .filter((item) => {
                            const lists = item.link.split("|");
                            return lists.some((item) =>
                              permissions.includes(`${item}.read`)
                            );
                          })
                          .map((itemChild) => (
                            <li
                              className={`flex justify-between group hover:bg-active-light hover:text-outline transition items-center ${checkActiveMenu(
                                itemChild.link
                              )}`}
                              key={itemChild.id}
                            >
                              <LinkCustom
                                href={
                                  process.env.NEXT_PUBLIC_ADMIN_URL +
                                  itemChild.link
                                }
                                className={`block py-2 px-4 flex-1 group-hover:before:bg-outline before:transition relative before:content-[''] before:absolute before:w-[6px] before:h-[6px] before:rounded-full before:border-current before:top-1/2 before:left-[-6px] before:-translate-y-1/2 ${checkActiveMenuChild(
                                  itemChild.link
                                )}`}
                              >
                                {itemChild.name}
                              </LinkCustom>
                              {itemChild.add &&
                              permissions.includes(
                                `${itemChild.link}.create`
                              ) ? (
                                <LinkCustom
                                  href={
                                    process.env.NEXT_PUBLIC_ADMIN_URL +
                                    itemChild.add
                                  }
                                  className="px-4 py-2 text-xl"
                                  title="Thêm"
                                >
                                  +
                                </LinkCustom>
                              ) : null}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li
                    className={`flex justify-between items-center hover:bg-active-light hover:text-outline transition mx-2 ${checkActiveMenu(
                      item.link
                    )}`}
                  >
                    <LinkCustom
                      href={
                        item.link === ""
                          ? process.env.NEXT_PUBLIC_ADMIN_URL.slice(0, -1)
                          : process.env.NEXT_PUBLIC_ADMIN_URL + item.link
                      }
                      className={`block px-4 w-full py-2`}
                    >
                      <span className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5" />
                        {item.name}
                      </span>
                    </LinkCustom>
                    {item.add && permissions.includes(`${item.link}.create`) ? (
                      <LinkCustom
                        href={process.env.NEXT_PUBLIC_ADMIN_URL + item.add}
                        className="px-4 py-2 text-xl"
                        title="Thêm"
                      >
                        +
                      </LinkCustom>
                    ) : null}
                  </li>
                )}
              </React.Fragment>
            );
          })}
      </ul>
      <SidebarProfile profile={profile} />
    </aside>
  );
};

export default Sidebar;
