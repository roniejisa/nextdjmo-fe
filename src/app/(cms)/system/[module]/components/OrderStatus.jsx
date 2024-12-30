"use client";

const status = {
  order: {
    label: "Đặt hàng",
    className: "bg-red-500 text-white px-2 py-1 rounded-md"
  },
  delivery: {
    label: "Đang giao",
    className: "bg-blue-500 text-white px-2 py-1 rounded-md"
  },
  done: {
    label: "Giao thành công",
    className: "bg-green-500 text-white px-2 py-1 rounded-md"
  },
  cancel: {
    label: "Hủy đơn",
    className: "bg-black-500 text-white px-2 py-1 rounded-md"
  }
}
const OrderStatus = ({ value, item, field }) => {
  const dataStatus = status[value];
  return (
    <div className={dataStatus?.className}>{dataStatus?.label}</div>
  )
}

export default OrderStatus  