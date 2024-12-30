"use client";

import { useNotify } from "@/context/NotifyProvider";
import { orderNow } from "./action";
import { useTransition } from "react";

const FormOrder = ({ children }) => {
  const notify = useNotify();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (form) => {
    startTransition(async () => {
      const body = Object.fromEntries(form);
      const response = await orderNow(body);
      if (response.status == 200) {
        if (response.data && response.data.url) {
          window.location.href = response.data.url;
          return false;
        }
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
