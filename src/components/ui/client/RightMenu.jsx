"use client";
import { ClientContext } from "@/context/ClientProvider";
import { useContext } from "react";

const RightMenu = () => {
  const { setShowModalSearch } = useContext(ClientContext);

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
