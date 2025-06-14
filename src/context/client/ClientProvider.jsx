"use client";
import { getDataDraftOrder } from "@/app/(client)/(web)/gio-hang/action";
import ModalSeach from "@/components/ui/client/ModalSeach";
import { createContext, useEffect, useRef, useState } from "react";

export const ClientContext = createContext();
const ClientProvider = ({ profile, ssId, children }) => {
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [updateCart, setUpdateCart] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  // HEADER
  const headerRef = useRef();
  const sectionRef = useRef({
    home: [],
  });

  const fetchData = async () => {
    const reponse = await getDataDraftOrder();
    if (reponse && reponse.status == 200 && reponse.data.length) {
      setOrders(reponse.data);
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

  useEffect(() => {
    const count = orders.reduce((acc, item) => {
      return +acc + +item.qty;
    }, 0);
    setTotalOrders(count);
  }, [orders]);

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
        headerRef,
        sectionRef,
        profile,
        ssId
      }}
    >
      {children}
      <ModalSeach />
    </ClientContext.Provider>
  );
};

export default ClientProvider;
