"use client";

import { useState } from "react";

const Tab = ({ data }) => {
  const [tabCurrent, setTabCurrent] = useState("details");
  let listData = [];
  try {
    listData = JSON.parse(data.specifications) || [];
  } catch (e) {}
  const handleChangeTab = (tab) => {
    setTabCurrent(tab);
  };
  return (
    <div className="flex gap-10 py-10">
      <div className="flex flex-[0_0_20%]">
        <ul className="flex flex-col gap-4">
          {listTab.map((item, index) => (
            <li key={index}>
              <span
                onClick={() => handleChangeTab(item.value)}
                className={`text-2xl ${
                  tabCurrent !== item.value ? "opacity-60" : "active"
                } transition animate-link cursor-pointer hover:opacity-100`}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <div
          data-id="details"
          className={`transition opacity-0 flex flex-col gap-3 ${
            tabCurrent === "details" ? "z-10 opacity-100" : "hidden z-0"
          }`}
        >
          <div className="flex">
            <span className="flex-[0_0_30%] text-gray-500 font-medium text-lg">
              Mô tả:
            </span>
            <p className="font-medium">{data.description}</p>
          </div>
          <div className="flex">
            <span className="flex-[0_0_30%] text-gray-500 font-medium text-lg">
              Kích thước:
            </span>
            <p className="font-medium">{data.dimension}</p>
          </div>
          <div className="flex">
            <span className="flex-[0_0_30%] text-gray-500 font-medium text-lg">
              Cân nặng:
            </span>
            <p className="font-medium">{data.weight} kg</p>
          </div>
          {listData.map((item, index) => (
            <div className="flex" key={index}>
              <span className="flex-[0_0_30%] text-gray-500 font-medium text-lg">
                {item.name}:
              </span>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <div
          data-id="about"
          className={`transition opacity-0 ${
            tabCurrent === "about" ? "z-10 opacity-100" : "hidden z-0"
          }`}
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
      </div>
    </div>
  );
};

export default Tab;

const listTab = [
  { name: "Chi tiết", value: "details" },
  { name: "Giới thiệu", value: "about" },
];
