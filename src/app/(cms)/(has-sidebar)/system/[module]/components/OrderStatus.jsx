"use client";

import { useNotify } from "@/context/NotifyProvider";
import { changeOrderStatus } from "../actions";
import { useState } from "react";

const status = {
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
