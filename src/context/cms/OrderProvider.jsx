"use client"
import { createContext, useState } from "react";

export const OrderContext = createContext();
const OrderProvider = ({ children, order }) => {
  const [data, setData] = useState(order);
  const [status, setStatus] = useState(
    `${order.status}|${order.payment_status}`
  );
  return (
    <OrderContext.Provider value={{ data, setData, status, setStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
