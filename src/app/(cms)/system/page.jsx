import { notFound } from "next/navigation";
import { getProfile } from "./[module]/actions";
import ItemCount from "@/components/ui/admin/statistics/ItemCount";
import OrderChart from "@/components/ui/admin/statistics/OrderChart";

const Dashboard = async () => {
  const profile = await getProfile();
  if (
    profile &&
    profile?.permissions &&
    profile?.permissions.filter((permission) => permission.includes(".read"))
      .length === 0
  )
    return notFound();
  return (
    <div className="p-4">
      <div className="">
        <h3 className="text-2xl mb-3">Ecommerce</h3>
        <div className="flex -mx-2">
          {items.map((item, index) => (
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
                <h3>Sản phẩm</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const items = [
  {
    module: "customer",
    name: "Khách hàng",
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
    module: "order",
    name: "Đơn hàng",
    icon: "ecommerce",
    class: "bg-[#f2e8ff]",
    link: "orders",
  },
  {
    module: "author",
    name: "Tác giả",
    icon: "link",
    class: "bg-[#feccd3]",
    link: "authors",
  },
];
