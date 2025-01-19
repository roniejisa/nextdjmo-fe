"use client";
import ImageCustom from "@/components/Maintain/Image";
import { ClientContext } from "@/context/client/ClientProvider";
import LinkCustom from "@/packages/translation/Link";
import useRouterCustom from "@/packages/translation/Navigation";
import { showImageUrl } from "@/utils/client/util";
import { useContext, useRef, useState } from "react";

const RightMenu = () => {
  const { setShowModalSearch, totalOrders, orders } = useContext(ClientContext);
  const router = useRouterCustom();
  const handleShowSearch = () => {
    setShowModalSearch(true);
  };

  return (
    <ul className="items-center flex justify-end lg:pr-10 pr-4">
      {rightMenus?.map((menu) => (
        <li key={menu.id}>
          {menu.type === "showSearch" && (
            <button
              onClick={handleShowSearch}
              className="flex items-center py-2 gap-2"
            >
              <span>{menu.icon}</span>
              {/* <span className="hidden lg:block">{menu.name}</span> */}
            </button>
          )}
        </li>
      ))}
      <li>
        <div className="relative p-2 ml-4 block group">
          <button
            onClick={() => {
              router.push("/gio-hang");
            }}
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
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 17h-11v-14h-2" />
              <path d="M6 5l14 1l-1 7h-13" />
            </svg>
          </button>
          <span className="absolute top-0 right-0 translate-x-1/2 min-w-4 h-4 bg-active-dark rounded-full flex justify-center items-center p-2 text-white">
            {totalOrders}
          </span>
          <div>
            <div className="absolute top-12 right-0 w-[300px] bg-white shadow-md z-50 rounded-md before:content-[''] before:absolute before:w-10 before:cursor-pointer  before:h-10 before:transparent before:top-[-15px] before:right-0 after:content-[''] after:absolute after:border-solid after:border-b-8 after:border-r-[14px] after:border-l-[14px] after:border-transparent after:border-b-white after:bottom-full after:right-1 after:z-0 z-2 before:opacity-0 before:invisible after:opacity-0 after:invisible group-hover:before:opacity-100 group-hover:before:visible group-hover:after:opacity-100 group-hover:after:visible opacity-0 invisible group-hover:delay-0 group-hover:before:delay-0 before:transition-all before:duration-500 after:transition-all after:duration-500 group-hover:after:delay-0 before:delay-500 after:delay-500 delay-500 transition-all duration-500 group-hover:opacity-100 group-hover:visible">
              <div className="p-4">
                <div className="flex flex-col gap-2">
                  {orders.length > 0
                    ? orders?.map((order) => {
                        return (
                          <LinkCustom
                            key={order.product_variant_id}
                            href={`/san-pham/${order.slug}`}
                            className="link-header"
                          >
                            <div className="flex items-stretch gap-2">
                              <span className="relative w-[40px] h-[40px] shadow-2xl border">
                                <ImageCustom
                                  src={showImageUrl(order.image)}
                                  alt={order.name}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-contain"
                                />
                              </span>
                              <p
                                className="line-clamp-1 whitespace-nowrap leading-4"
                                title={order.name}
                              >
                                {order.name}
                              </p>
                              <span className="flex-1 text-right whitespace-nowrap leading-4 text-active text-sm">
                                {Intl.NumberFormat().format(order.price)} VND
                              </span>
                            </div>
                          </LinkCustom>
                        );
                      })
                    : "Chưa có sản phẩm nào trong giỏ hàng!"}
                </div>
                <div className="flex justify-end mt-3">
                  <LinkCustom
                    href="/gio-hang"
                    className="link-header bg-active-dark px-2 py-1 rounded-md text-white"
                  >
                    Xem giỏ hàng
                  </LinkCustom>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default RightMenu;

const rightMenus = [
  {
    id: 1,
    type: "showSearch",
    name: "Tìm kiếm",
    icon: (
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
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg>
    ),
  },
];
