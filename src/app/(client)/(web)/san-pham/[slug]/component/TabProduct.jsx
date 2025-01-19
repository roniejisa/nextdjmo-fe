"use client";

import { ProductContext } from "@/context/client/ProductProvider";
import CommentClient from "@/packages/comments/CommentClient";
import CommentContent from "@/packages/comments/CommentContent";
import { useContext, useState } from "react";

const TabProduct = () => {
  const [tab, setTab] = useState("description");
  const { product } = useContext(ProductContext);
  let specifications = [];
  try {
    specifications = JSON.parse(product.specifications);
  } catch (e) {}
  const activeTab = (tabCurrent) => {
    return `px-6 py-2 relative text-xl before:content-[''] before:left-0 before:transition-all before:h-[2px] before:bottom-0 before:absolute before:bg-active transition-all duration-300 ${
      tab === tabCurrent
        ? "before:w-full before:duration-300"
        : "before:w-0 before:duration-0"
    }`;
  };
  return (
    <div className="px-10">
      <ul className="flex mt-10 border-b">
        <li>
          <button
            className={activeTab("description")}
            onClick={() => setTab("description")}
          >
            Mô tả sản phẩm
          </button>
        </li>
        <li>
          <button
            className={activeTab("detail")}
            onClick={() => setTab("detail")}
          >
            Chi tiết sản phẩm
          </button>
        </li>
        <li>
          <button
            className={activeTab("review")}
            onClick={() => setTab("review")}
          >
            Đánh giá
          </button>
        </li>
      </ul>
      <div className="overflow-hidden">
        <div
          className={`trasition-all ${
            tab === "description"
              ? "duration-300 opacity-100 visible pointer-events-auto"
              : "duration-0 opacity-0 invisible pointer-events-none h-0 translate-y-[500px]"
          }`}
        >
          <div className="p-4">
            <h3>Mô tả sản phẩm</h3>
            <div dangerouslySetInnerHTML={{ __html: product.content }}></div>
          </div>
        </div>
        <div
          className={`trasition-all ${
            tab === "detail"
              ? "duration-300 opacity-100 visible pointer-events-auto"
              : "duration-0 opacity-0 invisible pointer-events-none h-0 translate-y-[500px]"
          }`}
        >
          <div className="p-4">
            <h3>Chi tiết sản phẩm</h3>
            <div>
              {specifications?.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="flex flex-wrap">
                      <div className="flex-[0_0_200px]">{item.name}:</div>
                      <div>{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={`trasition-all ${
            tab === "review"
              ? "duration-300 opacity-100 visible pointer-events-auto"
              : "duration-0 opacity-0 invisible pointer-events-none h-0 translate-y-[500px]"
          }`}
        >
          <CommentClient type="product" id={product._id}>
            <CommentContent />
          </CommentClient>
        </div>
      </div>
    </div>
  );
};

export default TabProduct;
