"use client";

import { useEffect, useRef, useState } from "react";
import Translate from "./components/Translate";
import Statistic from "./components/Statistic";
import Map from "./components/Map";
import ChartComponent from "./components/Chart";

const listTab = [
  {
    label: "Dịch",
    name: "translate",
    component: Translate,
  },
  {
    label: "Thống kê",
    name: "statistic",
    component: Statistic,
  },
  {
    label: "Biểu đồ",
    name: "chart",
    component: ChartComponent,
  },
  {
    label: "Bản đồ",
    name: "map",
    component: Map,
  },
];
const ExplodeClient = () => {
  const [tab, setTab] = useState(null);
  const tabRef = useRef({});

  const changeTab = (tab) => {
    const element = document.querySelector(`.${tab}`);
    const header = document.querySelector("header");
    const headerHeight = header.offsetHeight;
    window.scrollTo(0, element.offsetTop - headerHeight);
    element.classList.add("active");
    setTab(tab);
  };
  useEffect(() => {
    if (!tabRef.current) return;
    const handleScroll = () => {
      const scroll = window.scrollY;
      const topSpace = Math.floor(window.innerHeight / 2);
      for (const [tab, element] of Object.entries(tabRef.current)) {
        if (
          scroll >= element.offsetTop - topSpace &&
          scroll < element.offsetTop - topSpace + element.clientHeight
        ) {
          setTab(tab);
          return;
        }
      }
      setTab(null);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeTab = (key) => {
    if (tab === key) {
      return "opacity-100";
    } else {
      return "opacity-50 translate-x-[30px]";
    }
  };
  return (
    <div className="flex flex-wrap gap-4">
      <ul className="sticky top-[120px] self-start flex-[0_0_20%]">
        {listTab.map((item, index) => {
          return (
            <li key={index}>
              <button
                className={`shadow-3d p-2 ${tab == item.name ? `text-active` : ""}`}
                onClick={() => changeTab(item.name)}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex-1 max-w-[80%]">
        {listTab.map((item, index) => {
          const Component = item.component;
          return (
            <div
              className={`h-screen ${
                item.name
              } transition-all duration-400 ${activeTab(item.name)}`}
              ref={(el) => (tabRef.current[item.name] = el)}
              key={index}
            >
              <Component />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplodeClient;
