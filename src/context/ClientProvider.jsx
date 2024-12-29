"use client";
import { getDataDraftOrder } from "@/app/(client)/(web)/gio-hang/action";
import ModalSeach from "@/components/ui/client/ModalSeach";
import { createContext, useEffect, useRef, useState } from "react";

export const ClientContext = createContext();
const ClientProvider = ({ children }) => {
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [updateCart, setUpdateCart] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    const reponse = await getDataDraftOrder();
    if (reponse.status == 200 && reponse.data.length) {
      const count = reponse.data.reduce((acc, item) => {
        return acc + item.qty;
      }, 0);
      setOrders(reponse.data);
      setTotalOrders(count);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (updateCart) {
      fetchData();
      setUpdateCart(false);
    }
  }, [updateCart]);

  return (
    <ClientContext.Provider
      value={{
        showModalSearch,
        setShowModalSearch,
        totalOrders,
        setTotalOrders,
        orders,
        setOrders,
        updateCart,
        setUpdateCart,
      }}
    >
      {children}
      <ModalSeach />
    </ClientContext.Provider>
  );
};

export default ClientProvider;
