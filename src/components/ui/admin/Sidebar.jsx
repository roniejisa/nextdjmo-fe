"use client";
import LinkCustom from "@/packages/translation/Link";
import { usePathname } from "next/navigation";
import SidebarProfile from "./SidebarProfile";
import useRouterCustom from "@/packages/translation/Navigation";
import React from "react";
const Sidebar = ({ profile }) => {
  const router = useRouterCustom();
  const pathname = usePathname();
  if (!profile) {
    return <></>;
  }
  const checkActiveMenu = (link, hasChild = false) => {
    const listLink = link.split("|");
    if (
      listLink.some(
        (link) => pathname === process.env.NEXT_PUBLIC_ADMIN_URL + link
      )
    ) {
      return hasChild
        ? "bg-red-400 text-white rounded-md active"
        : "bg-blue-700 text-white rounded-md";
    } else {
      return "";
    }
  };
  if (!profile || !profile.permissions) return router.replace("/");
  const { permissions } = profile;
  return (
    <aside className="invisible fixed lg:relative lg:visible w-[280px] shadow-lg h-screen lg:h-[calc(100vh-16px*2)] rounded-none lg:rounded-2xl bg-main flex-col bg-background-sidebar-admin">
      <div>
        <LinkCustom href={"/"} title="Trang chủ" className="p-4 block">
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
            className=""
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
        </LinkCustom>
      </div>
      <ul className="flex-1 h-[calc(100vh-16px*2-48px-16px*2-56px)] overflow-auto">
        {items
          .filter((item) => {
            const lists = item.link.split("|");
            return lists.some((item) => permissions.includes(`${item}.read`));
          })
          .map((item) => (
            <React.Fragment key={item.id}>
              {item.items ? (
                <li
                  className={`flex justify-between items-center mx-2 border-b`}
                >
                  <div className="w-full menu-sidebar">
                    <label
                      className={`flex justify-between items-center w-full p-4 cursor-pointer ${checkActiveMenu(
                        item.link,
                        true
                      )}`}
                      htmlFor={`menu-sidebar-${item.id}`}
                    >
                      {item.name}
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
                        className="transition"
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
                            className={`flex justify-between items-center ${checkActiveMenu(
                              itemChild.link
                            )}`}
                            key={itemChild.id}
                          >
                            <LinkCustom
                              href={
                                process.env.NEXT_PUBLIC_ADMIN_URL +
                                itemChild.link
                              }
                              className="block p-4"
                            >
                              {itemChild.name}
                            </LinkCustom>
                            {itemChild.add &&
                            permissions.includes(`${itemChild.link}.create`) ? (
                              <LinkCustom
                                href={
                                  process.env.NEXT_PUBLIC_ADMIN_URL +
                                  itemChild.add
                                }
                                className="mr-4 text-3xl text-green-500"
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
                  className={`flex justify-between items-center mx-2 border-b ${checkActiveMenu(
                    item.link
                  )}`}
                >
                  <LinkCustom
                    href={process.env.NEXT_PUBLIC_ADMIN_URL + item.link}
                    className={`block p-4`}
                  >
                    {item.name}
                  </LinkCustom>
                  {item.add && permissions.includes(`${item.link}.create`) ? (
                    <LinkCustom
                      href={process.env.NEXT_PUBLIC_ADMIN_URL + item.add}
                      className="mr-4 text-3xl text-green-500"
                      title="Thêm"
                    >
                      +
                    </LinkCustom>
                  ) : null}
                </li>
              )}
            </React.Fragment>
          ))}
      </ul>
      <SidebarProfile profile={profile} />
    </aside>
  );
};

export default Sidebar;

const items = [
  {
    id: 1,
    name: "Tài khoản",
    link: "customers||roles",
    items: [
      {
        id: 1.1,
        name: "Người dùng",
        link: "customers",
        add: "customers/create",
      },
      {
        id: 1.2,
        name: "Vai trò",
        link: "roles",
        add: "roles/create",
      },
    ],
  },
  {
    id: 2,
    name: "Sản phẩm & Tác giả",
    link: "products|authors|product-categories",
    items: [
      {
        id: 2.1,
        name: "Nghệ sĩ",
        link: "authors",
        add: "authors/create",
      },
      {
        id: 2.2,
        name: "Tác phẩm",
        link: "products",
        add: "products/create",
      },
      {
        id: 2.3,
        name: "Danh mục",
        link: "product-categories",
        add: "product-categories/create",
      },
    ],
  },
  {
    id: 3,
    name: "Cấu hình",
    link: "settings",
    add: "settings/create",
  },
  {
    id: 4,
    name: "Menus",
    link: "links",
    add: "links/create",
  },
  {
    id: 5,
    name: "Biểu mẫu",
    link: "contacts|receive-notifications",
    items: [
      {
        id: 5.1,
        name: "Liên hệ",
        link: "contacts",
        add: "contacts/create",
      },
      {
        id: 5.2,
        name: "Đăng ký nhận tin",
        link: "receive-notifications",
      },
    ],
  },
  {
    id: 6,
    name: "Quản lý đơn hàng",
    link: "orders|draft-orders",
    items: [
      {
        id: 6.1,
        name: "Đơn hàng",
        link: "orders",
      },
      {
        id: 6.2,
        name: "Giỏ hàng",
        link: "draft-orders",
      }
    ],
  }
];
