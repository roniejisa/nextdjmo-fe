"use client";

import { OrderContext } from "@/context/cms/OrderProvider";
import { useContext } from "react";

const paymentStatus = {
  pending: {
    label: "Chưa thanh toán",
    className: "bg-yellow-100 text-yellow-500 px-2 py-1 rounded-md",
  },
  paid: {
    label: "Đã thanh toán",
    className: "bg-green-100 text-green-500 px-2 py-1 rounded-md",
  },
  fail: {
    label: "Thanh toán thất bại",
    className: "bg-red-100 text-red-500 px-2 py-1 rounded-md",
  },
};

const PaymentStatus = () => {
  const { status } = useContext(OrderContext);
  const [_, payment_status] = status.split("|");
  return (
    <span className={paymentStatus[payment_status].className}>
      {paymentStatus[payment_status].label}
    </span>
  );
};

export default PaymentStatus;
