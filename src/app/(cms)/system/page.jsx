import { notFound } from "next/navigation";
import { getProfile } from "./[module]/actions";
import ItemCount from "@/components/ui/admin/statistics/ItemCount";
import OrderChart from "@/components/ui/admin/statistics/OrderChart";
import { getToken } from "@/utils/server/utils";
import { httpClient } from "@/utils/http";
import Image from "next/image";
import { showImageUrl } from "@/utils/client/util";

const getProductHot = async () => {
    const token = await getToken()
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/products",{
        Authorization: `Bearer ${token}`
    })
    return response.data
}
const Dashboard = async () => {
  const profile = await getProfile();
  const hotProducts = await getProductHot();
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
        <div className="flex flex-wrap -mx-2">
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
                <h3 className="text-2xl my-4">Sản phẩm bán chạy</h3>
                <div className="flex flex-col gap-2">
                  {hotProducts?.products.map((product) => (
                    <div key={product.product_id}>
                      <div className="flex gap-2">
                        <span className="block w-14 h-16 relative bg-gray-200">
                          <Image src={showImageUrl(product.image)} fill={true} className={`object-contain p-1`} alt={""}/>
                        </span>
                        <div>
                          <h3>{product.name}</h3>
                          <span className="text-xs text-gray-400">Đã bán: {product.qty}</span>
                        </div>
                      </div>
                      <div>

                      </div>
                    </div>
                  ))}
                </div>
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
