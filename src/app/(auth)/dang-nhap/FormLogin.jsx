"use client";

import { handleLogin } from "./action";
import { useEffect, useState, useTransition } from "react";
import InputTypeOne from "@/components/Input/InputTypeOne";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";

const FormLogin = ({ msg, redirect }) => {
  const notify = useNotify();
  const [isPending, startTransition] = useTransition();
  const router = useRouterCustom();
  const [oldData, setOldData] = useState({});
  const submitAction = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      const response = await handleLogin(formData);
      if (response.status == 200) {
        notify.changeNotify("success", response.message);
        if (redirect) {
          router.push(redirect, true);
        }else{
          router.push("/system");
        }
        router.refresh();
      } else {
        setOldData(formData);
        notify.changeNotify("error", response.message);
      }
    });
  };

  useEffect(() => {
    if (msg) {
      notify.changeNotify("error", msg);
      document.cookie = "msg=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form action={submitAction}>
      <InputTypeOne
        name="username"
        placeholder="Tên người dùng"
        type="text"
        defaultValue={oldData.username}
      />
      <InputTypeOne
        name="password"
        placeholder="Mật khẩu"
        type="password"
        defaultValue={oldData.password}
      />
      <button
        type="submit"
        disabled={isPending}
        className="py-4 bg-[#00CED1] rounded-lg w-16 h-16 flex items-center justify-center mx-auto text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        <svg
          className="w-6 h-6"
          role="img"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="forward"
        >
          <path d="M22.8011 14.75L14.2234 6.70971L16.0474 5L26.8695 15.1441C27.3732 15.6163 27.3732 16.3817 26.8695 16.8538L16.0474 26.998L14.2234 25.2883L22.7989 17.25H4.75V14.75H22.8011Z"></path>
        </svg>
      </button>
    </form>
  );
};

export default FormLogin;
