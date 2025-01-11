"use client";

import { useContext, useState } from "react";
import { changeOrderStatus } from "./action";
import { useNotify } from "@/context/NotifyProvider";
import { OrderContext } from "@/context/cms/OrderProvider";

const Form = ({ order }) => {
  const { status, setStatus } = useContext(OrderContext);
  const notify = useNotify();
  const handleChangeStatusOrder = async (e) => {
    if (!e.target.value) return false;
    const response = await changeOrderStatus({
      type: e.target.value,
      _id: order._id,
    });
    if (response.status === 200) {
      setStatus(e.target.value);
    }
    notify.changeNotify(
      response.status == 200 ? "success" : "error",
      response.message
    );
  };
  return (
    <div className="flex flex-wrap break-all justify-between gap-4 w-full mt-4">
      <label className="whitespace-nowrap">
        Trạng thái đơn hàng (<span className="text-red-500">*</span> Tuyệt đối
        chính xác ảnh hưởng tới thống kê thực tế)
      </label>
      <select
        className="px-2 rounded-none p-2"
        defaultValue={status}
        onChange={(e) => handleChangeStatusOrder(e)}
      >
        <option value="">-- Thay đổi trạng thái đơn hàng --</option>
        <option value="order|pending">Đặt hàng & Chưa thanh toán</option>
        <option value="order|paid">Đặt hàng & Đã thanh toán</option>
        <option value="order|fail">Đặt hàng & Thanh toán thất bại</option>
        <option value="delivery|pending">Đang giao & Chưa thanh toán</option>
        <option value="delivery|paid">Đang giao & Đã thanh toán</option>
        <option value="delivery|fail">Đang giao & Thanh toán thất bại</option>
        <option value="done|pending">Đã giao & Chưa thanh toán</option>
        <option value="done|paid">Đã giao & Đã thanh toán</option>
        <option value="done|fail">Đã giao & Chưa thanh toán</option>
        <option value="cancel|pending">Đã hủy & Chưa thanh toán</option>
        <option value="cancel|paid">Đã hủy & Đã thanh toán</option>
        <option value="cancel|fail">Đã hủy & Thanh toán thất bại</option>
      </select>
    </div>
  );
};

export default Form;
