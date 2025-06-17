"use client";

import { useNotify } from "@/context/NotifyProvider";
import { changeOrderStatus } from "../actions";
import { useState } from "react";

const status = {
  order: {
    label: "Đặt hàng",
    className: "bg-red-100 text-red-500 px-2 py-1 border border-red-100 rounded-md outline-none",
  },
  delivery: {
    label: "Đang giao",
    className: "bg-blue-100 text-blue-500 px-2 py-1 border border-blue-100 rounded-md outline-none",
  },
  done: {
    label: "Giao thành công",
    className: "bg-green-100 text-green-500 px-2 py-1 border border-green-100 rounded-md outline-none",
  },
  cancel: {
    label: "Hủy đơn",
    className: "bg-gray-100 text-gray-500 text-white px-2 py-1 border border-gray-100 rounded-md outline-none",
  },
};

const OrderStatus = ({ value, item, field }) => {
  const [data,setData] = useState(value)
  const notify = useNotify()
  return (
    <div>
      <select defaultValue={data} onChange={async(e) => {
          const data = await changeOrderStatus(e.target.value,item._id)
          notify.changeNotify(data.status == 200 ? "success" : "error", data.message)
          setData(e.target.value)
      }} className={status[data].className}>
        <option className="bg-white text-black" value="order">Đặt hàng</option>
        <option className="bg-white text-black" value="delivery">Đang giao</option>
        <option className="bg-white text-black" value="done">Đã giao</option>
        <option className="bg-white text-black" value="cancel">Hủy đơn</option>
      </select>
    </div>
  );
};

export default OrderStatus;
