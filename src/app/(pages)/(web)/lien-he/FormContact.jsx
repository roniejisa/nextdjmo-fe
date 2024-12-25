"use client";

import { useNotify } from "@/context/NotifyProvider";
import { submitContact } from "./action";
import { useRef, useState } from "react";
import { isValidEmail, isValidPhone } from "@/utils/client/validate";

const FormContact = () => {
  const notify = useNotify();
  const formRef = useRef(null);
  const submitForm = async (form) => {
    if (
      form.get("name") &&
      form.get("email") &&
      form.get("phone") &&
      form.get("message")
    ) {
      if (!isValidEmail(form.get("email"))) {
        notify.changeNotify("error", "Email không hợp lệ!");
      } else if (!isValidPhone(form.get("phone"))) {
        notify.changeNotify("error", "Số điện thoại không hợp lệ!");
      } else {
        const data = await submitContact(form);
        if (data.status == 200) {
          notify.changeNotify("success", data.message);
          formRef.current.reset();
        }else{
          notify.changeNotify("error", data.message);
        }
      }
    } else {
      notify.changeNotify("error", "Vui lòng điền đầy đủ thông tin!");
    }
  };
  return (
    <form action={submitForm} className="pb-10" ref={formRef}>
      <div className="grid grid-cols-3 gap-4">
        <input
          name="name"
          type="text"
          placeholder="Họ và tên"
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
        <input
          name="email"
          type="text"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
        <input
          name="phone"
          type="text"
          placeholder="Số điện thoại"
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
      </div>
      <div className="mt-4 w-full">
        <textarea
          name="message"
          placeholder="Nội dung"
          rows={10}
          className="border border-gray-300 p-2 rounded-md w-full outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-10 rounded-md mt-4"
      >
        Gửi
      </button>
    </form>
  );
};

export default FormContact;
