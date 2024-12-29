"use client";
import { ClientContext } from "@/context/ClientProvider";
import LinkCustom from "@/packages/translation/Link";
import useRouterCustom from "@/packages/translation/Navigation";
import { showImageUrl } from "@/utils/client/util";
import Image from "next/image";
import { useContext, useState } from "react";

const RightMenu = () => {
  const { setShowModalSearch, totalOrders, orders } = useContext(ClientContext);
  const [showOrder, setShowOrder] = useState(false);
  const router = useRouterCustom();
  const handleShowSearch = () => {
    setShowModalSearch(true);
  };

  return (
    <ul className="items-center flex justify-end lg:pr-10 pr-4">
      {rightMenus.map((menu) => (
        <li key={menu.id}>
          {menu.type === "showSearch" && (
            <button
              onClick={handleShowSearch}
              className="flex items-center py-2 gap-2"
            >
              <span>{menu.icon}</span>
              <span className="hidden lg:block">{menu.name}</span>
            </button>
          )}
        </li>
      ))}
      <li>
        <button
          onClick={() => {
            router.push("/gio-hang");
          }}
          onMouseEnter={(e) => setShowOrder(true)}
          onMouseLeave={(e) => setShowOrder(false)}
          className="relative p-2 ml-4 block"
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
          <span className="absolute top-0 right-0 translate-x-1/2 min-w-4 h-4 bg-red-500 rounded-full flex justify-center items-center p-2 text-white">
            {totalOrders}
          </span>
          <div>
            {showOrder && (
              <div
                className="absolute top-12 right-0 w-[300px] bg-white shadow-md z-50 rounded-md before:content-[''] before:absolute before:w-20 before:h-10 before:bg-transparent before:top-[-25px] before:right-0"
                onMouseEnter={(e) => setShowOrder(true)}
                onMouseLeave={(e) => setShowOrder(false)}
              >
                <div className="p-4">
                  <div>
                    {orders.map((order) => {
                      return (
                        <LinkCustom
                          key={order._id}
                          href={`/chi-tiet-don-hang/${order._id}`}
                          className="link-header"
                        >
                          <div className="flex items-stretch gap-2 ">
                            <span className="relative w-[40px] h-[40px] shadow-2xl border">
                              <Image
                                src={showImageUrl(order.image)}
                                alt={order.name}
                                width={100}
                                height={100}
                                className="w-full h-full object-contain"
                              />
                            </span>
                            <p className="line-clamp-1" title={order.name}>
                              {order.name}
                            </p>
                            <span className="flex-1 text-right whitespace-nowrap text-red-500 text-sm">
                              {Intl.NumberFormat().format(order.price)} VND
                            </span>
                          </div>
                        </LinkCustom>
                      );
                    })}
                  </div>
                  <div className="flex">
                    <LinkCustom href="/gio-hang" className="link-header">
                      Giỏ hàng
                    </LinkCustom>
                  </div>
                </div>
              </div>
            )}
          </div>
        </button>
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
        className="w-6 h-6 lg:w-4 lg:h-4"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg>
    ),
  },
];
