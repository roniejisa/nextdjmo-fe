"use client";
import ImageCustom from "@/components/Maintain/Image";
import React, { useEffect, useRef, useState } from "react";
import { getNews } from "./action";
import SkeletonWithChildren from "@/components/Skeleton/SkeletonWithChildren";
import Skeleton from "@/components/Skeleton/Skeleton";

const LIMIT = 9;
const NewsClient = ({ items }) => {
  const [news, setNews] = useState(items.slice(1));
  const pageRef = useRef(1);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(false);
  const firstNew = items[0];
  const observerRef = useRef(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const response = await getNews(pageRef.current, LIMIT);
      setNews((prev) => {
        return [...prev, ...response.data];
      });
      setLoading(false);
      if (response.data.length == 0) {
        loadMoreRef.current = false
      }
    };

    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading.current && loadMoreRef.current) {
            pageRef.current += 1;
            loadNews();
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreRef.current);
    return () => {
      observerRef.current && observerRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {}, [pageRef]);
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
        <SkeletonWithChildren
          delay={news.length > 10 ? 1000 : 0}
          length={9}
          loading={loading}
          skeletonComponent={news.map((item, index) => (
            <div className="col-span-1" key={item._id}>
              <div className="relative h-[200px]">
                <Skeleton height="200px" />
              </div>
              <div>
                <Skeleton>{item.name}</Skeleton>
              </div>
            </div>
          ))}
        >
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
        </SkeletonWithChildren>
        <div ref={loadMoreRef}></div>
      </div>
    </div>
  );
};

export default NewsClient;
