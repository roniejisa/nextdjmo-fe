"use client";

import { confirm2FA, handleLogin } from "./action";
import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { LoginContext } from "../providers/LoginProvider";

const FormLogin = ({ msg, redirect }) => {
  const notify = useNotify();
  const router = useRouterCustom();
  const [isPending, startTransition] = useTransition();
  const [oldData, setOldData] = useState({});
  const { showModalOTP, setShowModalOTP } = useContext(LoginContext);
  const [value, setValue] = useState("");
  const customerRef = useRef(null);
  const submitAction = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      const { status, data, message } = await handleLogin(formData);
      if (status == 200) {
        notify.changeNotify("success", message);
        if (data && data.customer_id) {
          customerRef.current = data.customer_id;
          setShowModalOTP(true);
        } else if (redirect) {
          router.push(redirect);
        } else {
          router.push("/system");
        }
        router.refresh();
      } else {
        setOldData(formData);
        notify.changeNotify("error", message);
      }
    });
  };

  const handleConfirm2FA = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      formData.customer_id = customerRef.current;
      const response = await confirm2FA(formData);
      if (response.status == 200) {
        notify.changeNotify("success", response.message);
        if (redirect) {
          router.push(redirect);
        } else {
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
    <>
      {showModalOTP ? (
        <form action={handleConfirm2FA} className="mt-10">
          <label className="mb-4 block">
            <span className="block mb-2 text-[#737373] font-medium">
              Nhập mã OTP
            </span>
            <input
              name="code"
              placeholder="Nhập mã OTP"
              autoComplete="off"
              onChange={(e) => setValue(e.target.value)}
              value={value}
              type="text"
              className="w-full py-4 outline-[#2a85ff] bg-[#f5f5f5] focus:bg-white font-bold px-3 rounded-2xl"
            />
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="py-4 mt-4 font-bold bg-[#2a85ff] w-full rounded-2xl flex items-center justify-center mx-auto text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Xác thực tài khoản
          </button>
        </form>
      ) : (
        <form action={submitAction} className="mt-10">
          <label className="mb-4 block">
            <span className="block mb-2 text-[#737373] font-medium">
              Tài khoản hoặc email
            </span>
            <input
              name="username"
              placeholder="Tài khoản hoặc email"
              autoComplete="off"
              type="text"
              defaultValue={oldData.username}
              className="w-full py-4 outline-[#2a85ff] bg-[#f5f5f5] focus:bg-white font-bold px-3 rounded-2xl"
            />
          </label>
          <label>
            <span className="block mb-2 text-[#737373] font-medium">
              Mật khẩu
            </span>

            <input
              className="w-full py-4 outline-[#2a85ff] bg-[#f5f5f5] focus:bg-white font-bold px-3 rounded-2xl"
              name="password"
              placeholder="Mật khẩu"
              autoComplete="off"
              type="password"
              defaultValue={oldData.password}
            />
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="py-4 mt-4 font-bold bg-[#2a85ff] w-full rounded-2xl flex items-center justify-center mx-auto text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Đăng nhập
            {/* <svg
        className="w-6 h-6"
        role="img"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="forward"
      >
        <path d="M22.8011 14.75L14.2234 6.70971L16.0474 5L26.8695 15.1441C27.3732 15.6163 27.3732 16.3817 26.8695 16.8538L16.0474 26.998L14.2234 25.2883L22.7989 17.25H4.75V14.75H22.8011Z"></path>
      </svg> */}
          </button>
        </form>
      )}
    </>
  );
};

export default FormLogin;
