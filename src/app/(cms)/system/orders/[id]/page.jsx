import { httpClient } from "@/utils/http";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cache } from "react";
import { getProfile } from "../../[module]/actions";
import Image from "next/image";
import { showImageUrl } from "@/utils/client/util";
import Form from "./Form";
import OrderProvider from "@/context/OrderProvider";
import StatusRow from "./components/StatusRow";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const orderDetail = async (id) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  return httpClient(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}orders/${id}`, {
    isAdmin: 1,
    Authorization: `Bearer ${token}`,
  });
};

const cacheOrderDetail = cache(async (id) => {
  return orderDetail(id);
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await cacheOrderDetail(id);
  if (!Object.keys(data).length) {
    return redirect(403);
  }
  return {
    title: data.data.module.name,
  };
}

const orderStatus = {
  order: {
    label: "Đặt hàng",
    className: "bg-red-500 text-white px-2 py-1 rounded-md",
  },
  delivery: {
    label: "Đang giao",
    className: "bg-blue-500 text-white px-2 py-1 rounded-md",
  },
  success: {
    label: "Giao thành công",
    className: "bg-green-500 text-white px-2 py-1 rounded-md",
  },
  cancel: {
    label: "Hủy đơn",
    className: "bg-black-500 text-white px-2 py-1 rounded-md",
  },
};
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

  return (
    <OrderProvider order={item}>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-3">Chi tiết đơn hàng</h1>
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr>
                  <th colSpan={5} className="bg-blue-500 text-white">
                    Thông tin chi tiết đơn hang
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-b px-4">Sản phẩm</td>
                  <td className="border-r border-b px-4">Số lượng</td>
                  <td className="border-r border-b px-4">Giá</td>
                  <td className="border-r border-b px-4">Thành tiền</td>
                </tr>
                {item.order_details.map((item) => (
                  <tr key={item._id}>
                    <td className="border-r border-b px-4">
                      <span>
                        <Image
                          src={showImageUrl(item.image)}
                          width={50}
                          height={50}
                          alt=""
                        />
                        {item.name}
                      </span>
                    </td>
                    <td className="border-r border-b px-4">{item.qty}</td>
                    <td className="border-r border-b px-4">
                      {Intl.NumberFormat().format(item.price)}
                    </td>
                    <td className="border-r border-b px-4">
                      {Intl.NumberFormat().format(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col flex-wrap gap-2 flex-[0_0_30%]">
            <table className="border flex-1">
              <thead>
                <tr>
                  <th colSpan={2} className="bg-blue-500 text-white">
                    Thông tin khách hàng
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-b px-4">Họ và tên</td>
                  <td className="border-b px-4">{item.name}</td>
                </tr>
                <tr>
                  <td className="border-r border-b px-4">Số điện thoại</td>
                  <td className="border-b px-4">{item.phone}</td>
                </tr>
                <tr>
                  <td className="border-r border-b px-4">Địa chỉ</td>
                  <td className="border-b px-4">{item.address}</td>
                </tr>
              </tbody>
            </table>
            <table className="border">
              <thead>
                <tr>
                  <th colSpan={2} className="bg-blue-500 text-white">
                    Thông tin đơn hàng
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-b px-4">Mã đơn hàng</td>
                  <td className="border-b px-4">{item._id}</td>
                </tr>
                <tr>
                  <td className="border-r border-b px-4">Tống tiền</td>
                  <td className="border-b px-4">{item.amount}</td>
                </tr>
                <StatusRow />
                <tr>
                  <td className="border-r border-b px-4">Ngày tạo</td>
                  <td className="border-b px-4">
                    {
                      new Date(item.order_created_at * 1000)
                        .toISOString()
                        .replace("T", " ")
                        .split(".")[0]
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Form order={item} />
        </div>
      </div>
    </OrderProvider>
  );
};

export default DetailComponent;
