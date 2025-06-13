// ORDER PROVIDER OF ADMIN
import { httpClient } from "@/utils/http";
import { redirect } from "next/navigation";
import { getProfile } from "../../[module]/actions";
import { showImageUrl } from "@/utils/client";
import Form from "./Form";
import OrderProvider from "@/context/cms/OrderProvider";
import OrderStatus from "./components/OrderStatus";
import ImageCustom from "@/components/Maintain/Image";
import PaymentStatus from "./components/PaymentStatus";
import ActivityOrder from "./components/ActivityOrder";
import { getToken } from "@/utils/server/utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const orderDetail = async (id) => {
  const token = await getToken();
  return httpClient(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}orders/${id}`, {
    isAdmin: 1,
    Authorization: `Bearer ${token}`,
  });
};

export async function generateMetadata() {
  return {
    title: "Chi tiết đơn hàng",
    robots: "noindex, nofollow",
  };
}

const DetailComponent = async ({ params }) => {
  const { id } = await params;
  const user = await getProfile();
  let { data } = await orderDetail(id);
  if (
    !Object.keys(data).length ||
    !user.permissions.includes(`orders.update`)
  ) {
    return redirect("/403");
  }
  let { item } = data;
  if (!item) {
    return redirect("/system/orders");
  }
  return (
    <OrderProvider order={item}>
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">Chi tiết đơn hàng #{item._id}</h1>
          <div>
            <OrderStatus />
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 flex flex-col gap-4">
            <div className="shadow-md p-4 rounded-md border">
              <p className="font-bold text-xl mb-4">Sản phẩm đã đặt</p>
              <div className="flex flex-wrap gap-2">
                {item.order_details.map((item) => (
                  <div
                    key={item._id}
                    className="flex w-full justify-between bg-active-light p-4 rounded-md"
                  >
                    <div className="flex gap-2">
                      <span className="flex items-center gap-4">
                        <ImageCustom
                          src={showImageUrl(item.image)}
                          width={100}
                          height={100}
                          alt=""
                        />
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <span className="text-sm text-gray-700">
                            {typeof item.variants === "string" &&
                              JSON.parse(item.variants).join(" - ")}
                          </span>
                        </div>
                      </span>
                    </div>
                    <div>
                      <p className="font-bold">
                        {Intl.NumberFormat().format(item.price * item.qty)} VND
                      </p>
                      <p className="text-sm">Số lượng: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="shadow-md p-4 rounded-md border">
              <div className="flex items-center gap-4">
                <p className="text-xl font-bold">Thanh toán</p>
                <PaymentStatus />
              </div>
              <div className="mt-4 flex justify-between">
                <p className="">Tống phụ</p>
                <p>{Intl.NumberFormat().format(item.amount)} VND</p>
              </div>
              <div className="mt-2 flex justify-between">
                <p className="">Phí vận chuyển</p>
                <p>
                  {Intl.NumberFormat().format(
                    item.amount_shipping ? item.amount_shipping : 0
                  )}{" "}
                  VND
                </p>
              </div>
              <div className="mt-2 flex justify-between">
                <p className="text-medium">Tổng số tiền</p>
                <p className="font-bold">
                  {Intl.NumberFormat().format(
                    Number(item.amount) +
                      (item.amount_shipping ? item.amount_shipping : 0)
                  )}{" "}
                  VND
                </p>
              </div>
              <div className="mt-4 py-2 flex border-t justify-between">
                <p className="text-bold">
                  Tổng số tiền khách hàng cần thanh toán
                </p>
                <p className="font-bold">
                  {Intl.NumberFormat().format(
                    Number(item.amount) +
                      (item.amount_shipping ? item.amount_shipping : 0)
                  )}{" "}
                  VND
                </p>
              </div>
            </div>
            <ActivityOrder order={item} />
          </div>

          <div className="flex-[0_0_30%]">
            <div className="w-full shadow-md p-4 rounded-md border mb-4">
              <p className="font-bold text-xl mb-4">Thông tin khách hàng</p>
              <div className="border-b py-4">
                <p className="text-lg font-bold mb-2">Họ và tên</p>
                <p className="">{item.name}</p>
              </div>
              <div className="border-b py-4">
                <p className="text-lg font-bold mb-2">Số điện thoại</p>
                <a
                  href={`tel:${item.phone}`}
                  className="transition hover:text-outline"
                >
                  {item.phone}
                </a>
              </div>
              <div className="py-4">
                <p className="text-lg font-bold mb-2">Địa chỉ</p>
                <a
                  href={`https://www.google.com/maps/search/${item.address}`}
                  target="_blank"
                  className="transition hover:text-outline"
                >
                  {item.address}
                </a>
              </div>
            </div>
            <div className="w-full shadow-md p-4 rounded-md border">
              <p className="font-bold text-xl mb-4">Ghi chú</p>
              <p className="">{item.note ? item.note : "Không có ghi chú"}</p>
            </div>
          </div>
          <Form order={item} />
        </div>
      </div>
    </OrderProvider>
  );
};

export default DetailComponent;
