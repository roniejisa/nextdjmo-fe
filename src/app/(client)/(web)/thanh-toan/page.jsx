"use client";

import { ClientContext } from "@/context/ClientProvider";
import LinkCustom from "@/packages/translation/Link";
import { showImageUrl } from "@/utils/client/util";
import Image from "next/image";
import { useContext } from "react";
import FormOrder from "./FormOrder";

const Checkout = () => {
  const { orders, setOrders } = useContext(ClientContext);
  return (
    <div className="lg:px-10 px-4 my-10">
      <FormOrder>
        <div className="flex lg:flex-row flex-col-reverse gap-4">
          <div className="flex-1">
            <div>
              <h3 className="font-bold text-3xl mb-10">Thông tin đặt hàng</h3>
              <div className="flex gap-4">
                <div className="lg:flex-[0_0_70%]">
                  <label className="block mb-2">Họ và tên</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Nhập họ và tên của bạn"
                    name="name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2">Số điện thoại</label>
                  <input
                    placeholder="Nhập số điện thoại của bạn"
                    type="text"
                    name="phone"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Địa chỉ</label>
                <input
                  placeholder="Địa chỉ nhận hàng của bạn"
                  type="text"
                  name="address"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Ghi chú</label>
                <input
                  placeholder="Ghi chú"
                  type="text"
                  name="note"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="forOtherUser" className="flex gap-2 mt-4">
                  <input type="checkbox" id="forOtherUser" />
                  <span>
                    Gọi cho người khác nhận hộ nếu chẳng may bạn bận 😊
                  </span>
                </label>
                <div className="flex gap-4">
                  <div className="lg:flex-[0_0_70%]">
                    <label className="block mb-2">Họ và tên</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      placeholder="Nhập họ và tên của bạn"
                      name="name_other"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2">Số điện thoại</label>
                    <input
                      placeholder="Nhập số điện thoại của bạn"
                      type="text"
                      n
                      name="phone_other"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3>Hình thức thanh toán</h3>
              <div>
                <label
                  htmlFor="payment-cod"
                  className="flex gap-2 mt-4 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    id="payment-cod"
                    value={"cod"}
                  />
                  <span>Thanh toán khi nhận hàng</span>
                </label>
                <label
                  htmlFor="payment-momo"
                  className="flex gap-2 mt-4 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    id="payment-momo"
                    value={"momo"}
                  />
                  <span>Ví Momo</span>
                </label>
                <label
                  htmlFor="vnpay"
                  className="flex gap-2 mt-4 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    id="vnpay"
                    value={"vnpay"}
                  />
                  <span>Thanh toán VNPAY</span>
                </label>
              </div>
            </div>
          </div>
          <div className="lg:flex-[0_0_40%] mt-10 lg:mt-0">
            <h1 className="font-bold text-3xl mb-10">Giỏ hàng</h1>
            {orders.length > 0 ? (
              <div className="flex flex-col border rounded-md">
                <div className="lg:flex hidden">
                  <div className="flex-1 font-bold border-b text-center">
                    Sản phẩm
                  </div>
                  <div className="flex-1 font-bold border-b text-center">
                    Giá
                  </div>
                  <div className="flex-1 font-bold border-b text-center">
                    Số lượng
                  </div>
                </div>
                {orders.map((item) => (
                  <div
                    key={item.product_variant_id}
                    className="lg:flex border-b items-center p-4 lg:p-0"
                  >
                    <div className="flex-1 flex text-center ">
                      <Image
                        src={showImageUrl(item.image)}
                        width={70}
                        height={70}
                        style={{ objectFit: "contain" }}
                        alt={"image"}
                      />
                      <LinkCustom
                        href={`/san-pham/${item.slug}`}
                        className="flex flex-col items-start gap-2 mt-2"
                      >
                        <p className="font-medium">{item.name}</p>
                        <span className="whitespace-nowrap">
                          Phân loại: {item.values.join(", ")}
                        </span>
                      </LinkCustom>
                    </div>
                    <p className="flex-1 lg:text-center">
                      <span className="lg:hidden mr-2 font-medium">Giá: </span>
                      {Intl.NumberFormat().format(item.price)} VND
                    </p>
                    <div className="flex-1 flex lg:justify-center">
                      <span className="lg:hidden mr-2 font-medium">
                        Số lượng:{" "}
                      </span>{" "}
                      {item.qty}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                Chưa có sản phẩm nào trong giỏ hàng!
              </div>
            )}
          </div>
        </div>
      </FormOrder>
    </div>
  );
};

export default Checkout;
