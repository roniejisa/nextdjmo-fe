"use client";

import { useNotify } from "@/context/NotifyProvider";
import { changePaymentStatus } from "../actions";
import { useState } from "react";

const status = {
  pending: {
    label: "Chờ thanh toán",
    className:
      "bg-yellow-100 text-yellow-500 px-2 py-1 border border-yellow-100 rounded-md",
  },
  paid: {
    label: "Đã thanh toán",
    className:
      "bg-green-100 text-green-500 px-2 py-1 border border-green-100 rounded-md",
  },
  fail: {
    label: "Thanh toán thất bại",
    className:
      "bg-red-100 text-red-500 px-2 py-1 border border-red-100 rounded-md",
  },
};

const PaymentStatus = ({ value, item, field }) => {
  const [data, setData] = useState(value);
  const notify = useNotify();
  return (
    <div>
      <select
        defaultValue={data}
        onChange={async (e) => {
          const data = await changePaymentStatus(e.target.value, item._id);
          notify.changeNotify(
            data.status == 200 ? "paid" : "error",
            data.message
          );
          setData(e.target.value);
        }}
        className={status[data].className}
      >
        <option className="bg-white text-black" value="pending">
          Chờ thanh toán
        </option>
        <option className="bg-white text-black" value="paid">
          Đã thanh toán
        </option>
        <option className="bg-white text-black" value="fail">
          Thanh toán thất bại
        </option>
      </select>
    </div>
  );
};

export default PaymentStatus;