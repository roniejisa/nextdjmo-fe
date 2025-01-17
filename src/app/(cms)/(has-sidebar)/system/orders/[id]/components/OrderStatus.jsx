"use client";

import { OrderContext } from "@/context/cms/OrderProvider";
import { useContext } from "react";

const orderStatus = {
  order: {
    label: "Đặt hàng",
    className: "text-red-500 bg-red-100 px-2 py-1 rounded-md",
  },
  delivery: {
    label: "Đang giao",
    className: "text-blue-500 bg-blue-100 px-2 py-1 rounded-md",
  },
  done: {
    label: "Giao thành công",
    className: "text-green-500 bg-green-100 px-2 py-1 rounded-md",
  },
  cancel: {
    label: "Hủy đơn",
    className: "text-gray-500 bg-gray-100 px-2 py-1 rounded-md",
  },
};

const OrderStatus = () => {
  const { status } = useContext(OrderContext);
  const [order_status] = status.split("|");
  return (
    <span className={orderStatus[order_status].className}>
      {orderStatus[order_status].label}
    </span>
  );
};

export default OrderStatus;
