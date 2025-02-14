"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Translate from "./components/Translate";
import Statistic from "./components/Statistic";
import Map from "./components/Map";
import ChartComponent from "./components/Chart";

const listTab = [
  { name: "Dịch", value: "translate" },
  { name: "Thống kê", value: "statistic" },
  { name: "Bản đồ", value: "map" },
  { name: "Bảng", value: "chart" },
];

const ExplodeClient = () => {
  const [tab, setTab] = useState(null);
  const tabRef = useRef({});
  useEffect(() => {
    if (tab) {
      const element = document.querySelector(`.${tab}`);
      window.scrollTo(0, element.offsetTop);
      element.classList.add("active");
    }
  }, [tab]);

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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div className="flex flex-wrap gap-4">
      <ul className="sticky top-[120px] self-start flex-[0_0_20%]">
        {listTab.map((item, index) => (
          <li key={index}>
            <button
              className={`${tab == item.value ? `text-active text-4xl` : ""}`}
              onClick={() => setTab(item.value)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex-1 max-w-[80%]">
        <motion.div
          key={tab} // Key giúp Framer Motion nhận biết sự thay đổi
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.6 }}
        >
          <div
            className={`min-h-screen translate`}
            ref={(el) => (tabRef.current.translate = el)}
          >
            <Translate />
          </div>
          <div
            className={`min-h-screen statistic`}
            ref={(el) => (tabRef.current.statistic = el)}
          >
            <Statistic />
          </div>
          <div
            className={`min-h-screen chart`}
            ref={(el) => (tabRef.current.chart = el)}
          >
            <ChartComponent />
          </div>
          <div
            className={`min-h-screen map`}
            ref={(el) => (tabRef.current.map = el)}
          >
            <Map />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExplodeClient;
