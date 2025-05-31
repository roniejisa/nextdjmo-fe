"use client";
import ItemCount from "@/components/ui/admin/statistics/ItemCount";
import OrderChart from "@/components/ui/admin/statistics/OrderChart";
import { showImageUrl } from "@/utils/client";
import { useEffect, useState } from "react";
import ImageCustom from "@/components/Maintain/Image";
import HistoryTab from "./HistoryTab";
const Client = ({ hotProducts, profile }) => {
  const [tab, setTab] = useState("general");
  const handleTab = (tab) => setTab(tab);

  useEffect(() => {}, [hotProducts]);

  const general_arr = generalStatistics.filter((item, index) => {
    return (
      profile?.permissions.filter((permission) => {
        return permission?.includes(`${item.module}s.read`);
      }).length > 0
    );
  });

  const permission_history =
    profile?.permissions.filter((permission) => {
      return permission.includes("history.read");
    }).length > 0;

  return (
    <div className="">
      <div className="mb-6">
        <ul className="flex gap-4">
          {general_arr.length && (
            <li>
              <button
                className={`${
                  tab == "general" ? "text-outline font-bold" : " "
                } text-xl`}
                onClick={() => handleTab("general")}
              >
                Tổng quan
              </button>
            </li>
          )}
          {/* <li>
            <button
              className={`${
                tab == "ecommerce" ? "text-outline font-bold" : " "
              } text-xl`}
              onClick={() => handleTab("ecommerce")}
            >
              Ecommerce
            </button>
          </li> */}
          {permission_history && (
            <li>
              <button
                className={`${
                  tab == "history" ? "text-outline font-bold" : " "
                } text-xl`}
                onClick={() => handleTab("history")}
              >
                Lịch sử
              </button>
            </li>
          )}
        </ul>
      </div>
      {permission_history && (
        <div className={tab == "history" ? "" : "hidden"}>
          <div className="flex flex-wrap -mx-2 w-full">
            <HistoryTab />
          </div>
        </div>
      )}
      <div className={tab == "general" ? "" : "hidden"}>
        <div className="flex flex-wrap -mx-2">
          {general_arr.map((item, index) => (
            <ItemCount
              item={item}
              key={index}
              className={`flex-[0_0_25%] px-2`}
            />
          ))}
        </div>
      </div>
      {/* <div className={tab == "ecommerce" ? "" : "hidden"}>
        <div className="flex flex-wrap -mx-2">
          {orderStatistics.map((item, index) => (
            <ItemCount
              item={item}
              key={index}
              className={`flex-[0_0_25%] px-2`}
            />
          ))}
        </div>
        <div className="my-3">
          <div className="flex -mx-2">
            <OrderChart />
            <div className="flex-[0_0_25%] px-2">
              <div>
                <h3 className="text-2xl my-4">Sản phẩm bán chạy</h3>
                <div className="flex flex-col gap-2">
                  {hotProducts?.products.map((product) => (
                    <div key={product.product_id}>
                      <div className="flex gap-2">
                        <span className="block w-14 h-16 relative bg-gray-200">
                          <ImageCustom
                            src={showImageUrl(product.image)}
                            fill={true}
                            className={`object-contain p-1`}
                            alt={""}
                          />
                        </span>
                        <div>
                          <h3>{product.name}</h3>
                          <span className="text-xs text-gray-400">
                            Đã bán: {product.qty}
                          </span>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Client;

const orderStatistics = [
  {
    module: "order",
    name: "Đơn hàng",
    icon: "ecommerce",
    class: "bg-[#f2e8ff]",
    link: "orders",
  },
];

const generalStatistics = [
  {
    module: "customer",
    name: "Tài khoản",
    icon: "customer",
    class: "bg-[#e0f2fe]",
    link: "customers",
  },
  {
    module: "product",
    name: "Sản phẩm",
    icon: "product",
    class: "bg-[#d2fae5]",
    link: "products",
  },

  {
    module: "author",
    name: "Tác giả",
    icon: "link",
    class: "bg-[#feccd3]",
    link: "authors",
  },
];
