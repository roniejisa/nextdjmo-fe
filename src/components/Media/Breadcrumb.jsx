"use client";

import { MediaContext } from "@/app/media/MediaProvider";
import { useContext } from "react";

const Breadcrumb = () => {
  const { breadcrumbs, setBreadcrumbs, resetDataFolder } =
    useContext(MediaContext);

  const handleChangeBreadcrumbs = (index) => {
    setBreadcrumbs((prev) => {
      if (index == -1) return [];
      const newPrev = prev.slice(0, index + 1);
      return newPrev;
    });
    resetDataFolder()
  };
  return (
    <div className="text-2xl font-medium flex items-center gap-2">
      <span
        {...(breadcrumbs.length > 0
          ? {
              onClick: () => handleChangeBreadcrumbs(-1),
            }
          : {})}
        className={
          breadcrumbs.length > 0
            ? "hover:text-outline transition cursor-pointer"
            : ""
        }
      >
        Quản lý tệp tin
      </span>
      {breadcrumbs.length > 0 &&
        breadcrumbs?.map((item, index) => {
          return (
            <span key={item._id} className="flex items-center gap-2">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-lg"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
              <span
                className={`${
                  index < breadcrumbs.length - 1
                    ? "hover:text-outline transition cursor-pointer"
                    : "text-outline"
                }`}
                {...(index < breadcrumbs.length - 1
                  ? {
                      onClick: () => handleChangeBreadcrumbs(index),
                    }
                  : {})}
              >
                {item.filename}
              </span>
            </span>
          );
        })}
    </div>
  );
};

export default Breadcrumb;
