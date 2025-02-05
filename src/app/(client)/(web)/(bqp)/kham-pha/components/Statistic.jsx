"use client";
import React, { useState } from "react";
import ButtonSubmit from "@/components/ButtonSubmit/ButtonSubmit";
import { motion } from "framer-motion";

const Statistic = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const submitSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let json = {};
    try {
      const response = await fetch("http://localhost:3000/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      json = await response.json();
    } catch (e) {
      json = [
        {
          name: "Không quân",
          quantity: 100000,
        },
        {
          name: "Hải quân",
          quantity: 100000,
        },
        {
          name: "Lục quân",
          quantity: 99000,
        },
        {
          name: "Quân đội",
          quantity: 100000,
        },
      ];
    }
    setData((data) => {
      if (Array.isArray(data)) {
        return [...data, ...json];
      }
      return json;
    });
    setIsLoading(false);
  };
  return (
    <div>
      <form onSubmit={submitSend} className="flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="rounded-md border w-full text-background py-1 px-2 focus:bg-border outline-none"
          placeholder="VD: Lực lượng quân đội Trung Quốc"
        />
        <ButtonSubmit label="Thống kê" />
      </form>
      <div className="mt-4">
        {data && (
          <ul>
            {data.map((item, index) => (
              <motion.li
                key={index}
                className="flex list-disc"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <p className="flex-[0_0_30%]">{item.name}:</p>
                <p className="">
                  {Intl.NumberFormat()
                    .format(item.quantity)
                    .replaceAll(",", ".")}
                </p>
              </motion.li>
            ))}
          </ul>
        )}
        {isLoading && <div>Đang thống kê...</div>}
      </div>
    </div>
  );
};

export default Statistic;
