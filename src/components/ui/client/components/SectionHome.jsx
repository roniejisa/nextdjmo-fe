"use client";

import { useEffect, useRef, useState } from "react";
import SectionItem from "./SectionItem";

const SectionHome = () => {
  const homeRef = useRef([]);
  const [index, setIndex] = useState(null);
  useEffect(() => {
    if (!homeRef.current.length) return;
    const handleScroll = (e) => {
      const scroll = window.scrollY;
      const topSpace = Math.floor(window.innerHeight / 2);

      for (let i = 0; i < homeRef.current.length; i++) {
        const item = homeRef.current[i];
        if (
          scroll >= item.offsetTop - topSpace &&
          scroll < item.offsetTop - topSpace + item.clientHeight
        ) {
          setIndex(i);
          return;
        }
      }
      setIndex(null);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [homeRef]);

  return (
    <div
      className="bg-fixed bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(https://picsum.photos/1912/924)`,
      }}
    >
      <SectionItem
        name="Cơ bản"
        index={index}
        number={0}
        ref={(el) => {
          el && !homeRef.current.includes(el) && homeRef.current.push(el);
        }}
      >
        <div className="py-20 px-8">
          <div>
            <h1 className="text-3xl">Phạm Minh Hiếu</h1>
            <p>Fullstack Developer</p>
          </div>
        </div>
      </SectionItem>
      <SectionItem
        name="Dự án"
        index={index}
        number={1}
        ref={(el) => {
          el && !homeRef.current.includes(el) && homeRef.current.push(el);
        }}
      >
        <div className="py-20 px-8">
          <div>
            <h3>NextDjMo</h3>
            <p>Phần thực hiện: Tất cả</p>
          </div>
        </div>
      </SectionItem>
      <SectionItem
        name="Kĩ năng"
        index={index}
        number={2}
        ref={(el) => {
          el && !homeRef.current.includes(el) && homeRef.current.push(el);
        }}
      ></SectionItem>
      <SectionItem
        name="Liên hệ"
        index={index}
        number={3}
        ref={(el) => {
          el && !homeRef.current.includes(el) && homeRef.current.push(el);
        }}
      >
        HEHEHE
      </SectionItem>
    </div>
  );
};

export default SectionHome;
