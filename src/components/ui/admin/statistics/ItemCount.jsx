"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/SocketProvider";
import { iconSVG } from "@/components/Icon/svg/constants";
import LinkCustom from "@/packages/translation/Link";
import CountUp from "@/components/CountUp/CountUp";
const ItemCount = ({ item, ...props }) => {
  const { socketRef, addTypes, types, sessionIdRef } =
    useContext(SocketContext);
  const [count, setCount] = useState(0);
  const IconComponent = iconSVG[item.icon];
  useEffect(() => {
    setInterval(() => {
      if (socketRef.current && sessionIdRef.current) {
        socketRef.current.sendEncode({
          type: "update-statistic-count",
          data: {
            module: item.module,
            id: sessionIdRef.current,
          },
        });
      }
    }, 5000);

    addTypes("update-statistic-count-" + item.module, (data) => {
      setCount(data.count);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinkCustom
      href={process.env.NEXT_PUBLIC_ADMIN_URL + item?.link}
      {...props}
    >
      <div
        className={`rounded-lg py-5 px-4 flex items-center justify-between ${item.class} transition-all hover:shadow-lg`}
      >
        <div className="flex flex-col gap-2 text-md font-medium">
          {item.name}
          <span className="font-medium text-2xl">
            <CountUp targetNumber={count} />
          </span>
        </div>
        <IconComponent className="h-10 w-10" />
      </div>
    </LinkCustom>
  );
};

export default ItemCount;
