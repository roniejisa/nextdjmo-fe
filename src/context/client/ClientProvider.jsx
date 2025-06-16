"use client";
import { getDataDraftOrder } from "@/app/(client)/(web)/gio-hang/action";
import ModalSeach from "@/components/ui/client/ModalSeach";
import {
  createContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

export const ClientContext = createContext();

const ClientProvider = ({ profile, ssId, children }) => {
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [updateCart, setUpdateCart] = useState(false);
  const [orders, setOrders] = useState([]);

  // Memoize totalOrders
  const totalOrders = useMemo(() => {
    return orders.reduce((acc, item) => +acc + +item.qty, 0);
  }, [orders]);

  const headerRef = useRef();
  const sectionRef = useRef({
    home: [],
  });

  // Memoize fetchData function
  const fetchData = useCallback(async () => {
    try {
      const response = await getDataDraftOrder();
      if (response && response.status === 200 && response.data.length) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (updateCart) {
      fetchData();
      setUpdateCart(false);
    }
  }, [updateCart, fetchData]);

  // Memoize context value để tránh re-render không cần thiết
  const contextValue = useMemo(
    () => ({
      showModalSearch,
      setShowModalSearch,
      totalOrders,
      orders,
      setOrders,
      updateCart,
      setUpdateCart,
      headerRef,
      sectionRef,
      profile,
      ssId,
    }),
    [showModalSearch, totalOrders, orders, updateCart, profile, ssId]
  );

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
      <ModalSeach />
    </ClientContext.Provider>
  );
};

export default ClientProvider;
