"use client";

import { useNotify } from "@/context/NotifyProvider";
import { orderNow } from "./action";
import { useContext, useTransition } from "react";
import { ClientContext } from "@/context/ClientProvider";
import useRouterCustom from "@/packages/translation/Navigation";

const FormOrder = ({ children }) => {
  const notify = useNotify();
  const [isPending, startTransition] = useTransition();
  const { setTotalOrders, setOrders } = useContext(ClientContext);
  const router = useRouterCustom();
  const handleSubmit = async (form) => {
    startTransition(async () => {
      const body = Object.fromEntries(form);
      const response = await orderNow(body);
      if (response.status == 200) {
        if (response.data && response.data.url) {
          window.location.href = response.data.url;
        } else {
          await router.push("/dat-hang-thanh-cong");
        }
        setTotalOrders(0);
        setOrders([]);
      }
      notify.changeNotify(
        response.status == 200 ? "success" : "error",
        response.message
      );
    });
  };

  return (
    <form action={handleSubmit}>
      {children}
      <div>
        <button disabled={isPending}>Thanh toán</button>
      </div>
    </form>
  );
};

export default FormOrder;
