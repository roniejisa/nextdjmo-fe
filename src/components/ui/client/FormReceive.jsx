"use client";
import { useNotify } from "@/context/NotifyProvider";
import { sentFormReceive } from "./action";
import { useRef } from "react";

const FormReceive = () => {
  const notify = useNotify();
  const formRef = useRef(null);
  const handleSentForm = async (form) => {
    const body = Object.fromEntries(form);
    const data = await sentFormReceive(body);
    if (data.status == 200) {
      formRef.current.reset();
      notify.changeNotify("success", data.message);
    } else {
      notify.changeNotify("error", data.message);
    }
  };

  return (
    <form action={handleSentForm} className="flex" ref={formRef}>
      <input
        type="text"
        name="email"
        placeholder="Nhập email"
        className="px-2 py-1 rounded-tl-md rounded-bl-md outline-none"
      />
      <button className="bg-white text-black px-2 py-1 rounded-tr-md rounded-br-md">
        Đăng ký nhận tin
      </button>
    </form>
  );
};

export default FormReceive;
