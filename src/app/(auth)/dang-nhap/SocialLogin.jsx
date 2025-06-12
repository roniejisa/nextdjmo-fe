"use client";

import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { LoginContext } from "../providers/LoginProvider";

const providers = [
  {
    name: "Google",
    url: process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/google/login/",
    class: "text-red-500",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/facebook/login/",
    class: "text-blue-500",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
      </svg>
    ),
  },
  // Thêm các provider khác nếu cần
];
const SocialLogin = ({ redirect }) => {
  const { showModalOTP, setShowModalOTP } = useContext(LoginContext);
  const router = useRouterCustom();
  const pathname = usePathname();
  const notify = useNotify();
  const handleLogin = (url) => {
    window.location.href = url; // Chuyển hướng đến backend
  };

  const openPopup = (url) => {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // Mở cửa sổ popup và giữ tham chiếu đến cửa sổ đó

    if (redirect) {
      url += `?redirect=${redirect}`;
    }
    const popupWindow = parent.window.open(
      url,
      "popupWindow",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  useEffect(() => {
    // Lắng nghe thông điệp từ cửa sổ popup
    const handleMessage = (event) => {
      const { type, created, redirect } = event.data;
      if (type === "login-social-success") {
        if (created.toLowerCase() == "true") {
          router.push("/system");
        } else {
          if (redirect != "None") {
            router.push(redirect);
          } else {
            router.push("/");
          }
        }
        return notify.changeNotify("success", "Đăng nhập thành công!");
      } else if (type === "login-social-fail") {
        notify.changeNotify("error", "Đăng nhập không thành công!");
      }
    };

    const channel = new BroadcastChannel("login-channel");
    channel.addEventListener("message", handleMessage);
    return () => channel.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {!showModalOTP && (
        <div className="flex gap-2 justify-center mt-10">
          {providers.map((provider) => (
            <button
              key={provider.name}
              onClick={() => openPopup(provider.url)}
              className="mt-2 flex gap-2 px-4 py-2 border rounded text-center"
            >
              <span>Login with </span>
              <span className={provider.class}>{provider.icon}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default SocialLogin;
