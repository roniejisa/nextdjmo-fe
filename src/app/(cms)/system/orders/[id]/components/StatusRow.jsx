"use client";

import { OrderContext } from "@/context/OrderProvider";
import { useContext } from "react";

const orderStatus = {
  order: {
    label: "Đặt hàng",
    className: "bg-red-500 text-white px-2 py-1 rounded-md",
  },
  delivery: {
    label: "Đang giao",
    className: "bg-blue-500 text-white px-2 py-1 rounded-md",
  },
  done: {
    label: "Giao thành công",
    className: "bg-green-500 text-white px-2 py-1 rounded-md",
  },
  cancel: {
    label: "Hủy đơn",
    className: "bg-black text-white px-2 py-1 rounded-md",
  },
};

const paymentStatus = {
  pending: {
    label: "Chưa thanh toán",
    className: "bg-yellow-500 text-white px-2 py-1 rounded-md",
  },
  paid: {
    label: "Đã thanh toán",
    className: "bg-green-500 text-white px-2 py-1 rounded-md",
  },
  fail: {
    label: "Thanh toán thất bại",
    className: "bg-red-500 text-white px-2 py-1 rounded-md",
  },
};

const StatusRow = () => {
  const { status } = useContext(OrderContext);
  const [order_status, payment_status] = status.split("|");
  return (
    <>
      <tr>
        <td className="border-r border-b px-4">Trạng thái</td>
        <td className="border-b px-4 py-1">
          <span className={orderStatus[order_status].className}>
            {orderStatus[order_status].label}
          </span>
        </td>
      </tr>
      <tr>
        <td className="border-r border-b px-4">Thanh toán</td>
        <td className="border-b px-4 py-1">
          <span className={paymentStatus[payment_status].className}>
            {paymentStatus[payment_status].label}
          </span>
        </td>
      </tr>
    </>
  );
};

export default StatusRow;
