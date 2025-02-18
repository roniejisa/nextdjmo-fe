"use client";

import React, { useEffect, useRef } from "react";
import SnowEffect from "./Snow";
import { convertDate } from "vietnamese-lunar-date";
import AutumnEffect from "./Autumn";
import ValentineEffect from "./Valentine";
import SunEffect from "./Sun";
import LunarEffect from "./Lunar";
import SpringEffect from "./Spring";
import NewYearEffect from "./NewYear";
import RandomEffect from "./Random";
import HalloWeenEffect from "./Halloween";

const getYear = (number = 0) => {
  const currentYear = new Date().getFullYear();
  return currentYear + number;
};

const getDateLunar = (date) => {
  try {
    const lunarDate = convertDate(date);
    return lunarDate;
  } catch (e) {
    return date;
  }
};

const events = [
  {
    name: "New Year",
    event_date: getYear() + "-12-30",
    end_date: getYear(1) + "-01-01",
    component: NewYearEffect,
    classBackground: "bg-transparent",
    classColor: "text-white",
  },
  {
    name: "Christmas",
    event_date: getYear() + "-12-23",
    end_date: getYear() + "-12-27",
    component: RandomEffect,
    classBackground: "bg-[#0e0a2f]",
    classColor: "text-white",
  },
  {
    name: "Winter",
    event_date: getYear(1) + "-12-01",
    end_date: getYear(1) + "-02-28",
    component: SnowEffect,
    classBackground: "bg-[#0e0a2f]",
    classColor: "text-white",
  },
  {
    name: "Halloween",
    event_date: getYear() + "-10-31",
    end_date: getYear() + "-11-01",
    component: HalloWeenEffect,
    classBackground: "bg-[#0e0a2f]",
    classColor: "text-white",
  },
  {
    name: "Autumn",
    event_date: getYear() + "-09-01",
    end_date: getYear() + "-11-30",
    component: AutumnEffect,
    classBackground: "bg-white",
    classColor: "",
  },
  {
    name: "Summer",
    event_date: getYear() + "-05-01",
    end_date: getYear() + "-08-31",
    component: SunEffect,
    classBackground: "",
    classColor: "",
  },
  {
    name: "Valentine's Day",
    event_date: getYear() + "-02-09",
    end_date: getYear() + "-02-15",
    component: ValentineEffect,
    classBackground: "",
    classColor: "",
  },
  {
    name: "Lunar New Year",
    event_date: getYear() + "-02-05",
    end_date: getYear() + "-02-10",
    component: LunarEffect,
    classBackground: "bg-[#0e0a2f]",
    classColor: "text-white",
  },
  {
    name: "Spring",
    event_date: getDateLunar("01/01/" + getYear(1)),
    end_date: getYear(1) + "-03-31",
    component: SpringEffect,
    classBackground: "bg-[#0e0a2f]",
    classColor: "text-black",
  },
];

function getNextEvent() {
  const today = new Date();
  const sortedEvents = events
    ?.map((event) => {
      // Convert event dates và xử lý năm
      const eventStartDate = new Date(event.event_date);
      const eventEndDate = new Date(event.end_date);

      // Nếu sự kiện đã qua, chuyển sang năm tiếp theo
      if (eventStartDate < today) {
        eventStartDate.setFullYear(eventStartDate.getFullYear() + 1);
        eventEndDate.setFullYear(eventEndDate.getFullYear() + 1);
      }

      // Tính độ dài của sự kiện
      const eventDuration =
        (eventEndDate - eventStartDate) / (1000 * 60 * 60 * 24); // Đổi sang ngày

      return {
        ...event,
        event_date: eventStartDate,
        end_date: eventEndDate,
        duration: eventDuration, // Thêm độ dài của sự kiện
      };
    })
    .filter((event) => event.event_date >= today) // Chỉ lấy sự kiện sau ngày hiện tại
    .sort((a, b) => {
      // Sắp xếp theo ngày bắt đầu
      if (a.event_date - b.event_date !== 0) {
        return a.event_date - b.event_date;
      }
      // Ưu tiên sự kiện có khoảng thời gian ngắn hơn
      return a.duration - b.duration;
    });
  // Trả về sự kiện gần nhất
  return sortedEvents[0] || null;
}

const AllEffect = () => {
  const eventDay = useRef(getNextEvent());

  useEffect(() => {
    if (!eventDay.current) return;

    // Thêm các lớp CSS cho sự kiện
    document.body.classList.add(
      eventDay.current?.classBackground,
      eventDay.current?.classColor
    );

    return () => {
      // Gỡ bỏ lớp CSS khi component bị unmount
      document.body.classList.remove(
        eventDay.current?.classBackground,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        eventDay.current?.classColor
      );
    };
  }, []);

  let Component = <></>;
  if (eventDay.current) {
    Component = eventDay.current.component;
  }

  return (
    <div className="pointer-events-none">
      <Component />
    </div>
  );
};

export default AllEffect;
