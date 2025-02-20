"use client";
import ImageCustom from "@/components/Maintain/Image";
import React, { useEffect, useState } from "react";

const LIMIT = 9;
const NewsClient = ({ items }) => {
  const [news, setNews] = useState(items.slice(1));
  const [page, setPage] = useState(1);
  const firstNew = items[0];
  useEffect(() => {
    console.log(firstNew);
    console.log(news);
  }, []);
  return (
    <div className="px-10">
      <div>
        <div className="grid grid-cols-2 gap-4 py-10">
          <div className="col-span-1 relative h-[300px]">
            <ImageCustom
              src={`/images/img.jpg`}
              alt={""}
              fill={true}
              className="object-cover object-top"
            />
          </div>
          <div>
            <h3 className="text-2xl">{firstNew.name}</h3>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {news.map((item, index) => {
          return (
            <div className="col-span-1" key={item._id}>
              <div className="relative h-[200px]">
                <ImageCustom
                  src={`/images/img.jpg`}
                  alt={""}
                  fill={true}
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3>{item.name}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsClient;
