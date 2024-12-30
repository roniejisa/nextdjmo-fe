"use client";

import { useNotify } from "@/context/NotifyProvider";
import { changeOrderStatus, changePaymentStatus } from "../actions";
import { useState } from "react";

const status = {
  pending: {
    label: "Đang giao",
    className: "bg-yellow-500 text-white px-2 py-1 rounded-md",
  },
  success: {
    label: "Thành công",
    className: "bg-blue-500 text-white px-2 py-1 rounded-md",
  },
  fail: {
    label: "Thanh toán thất bại",
    className: "bg-red-500 text-white px-2 py-1 rounded-md",
  }
};

const PaymentStatus = ({ value, item, field }) => {
  const [data,setData] = useState(value)
  const notify = useNotify()
  return (
    <div>
      <select defaultValue={data} onChange={async(e) => {
          const data = await changePaymentStatus(e.target.value,item._id)
          notify.changeNotify(data.status == 200 ? "success" : "error", data.message)
          setData(e.target.value)
      }} className={status[data].className}>
        <option className="bg-white text-black" value="pending">Chờ thanh toán</option>
        <option className="bg-white text-black" value="success">Đã thanh toán</option>
        <option className="bg-white text-black" value="fail">Thanh toán thất bại</option>
      </select>
    </div>
  );
};

export default PaymentStatus;
