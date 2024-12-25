"use client";

import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const providers = [
  { name: "Google", url: "http://localhost:8000/auth/google/login/" },
  { name: "Facebook", url: "http://localhost:8000/auth/facebook/login/" },
  // Thêm các provider khác nếu cần
];
const SocialLogin = () => {
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
    const popupWindow = window.open(
      url,
      "popupWindow",
      `width=${width},height=${height},top=${top},left=${left}`
    );
    popupWindow.onload = () => {
        console.log(this)
    };
    
  };

  useEffect(() => {
    // Lắng nghe thông điệp từ cửa sổ popup
    const handleMessage = (event) => {
      const { type, created } = event.data;
      if (type === "login-social-success") {
        console.log(created, created == "True")
        if (created.toLowerCase() == "true") {
          router.push("/account/profile");
        } else {
          router.push("/");
        }
      } else if (type === "login-social-fail") {
        notify.changeNotify("error", "Đăng nhập không thành công!");
      }
    };

    const channel = new BroadcastChannel("login-channel");
    channel.addEventListener("message", handleMessage);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {providers.map((provider) => (
        <button
          key={provider.name}
          onClick={() => openPopup(provider.url)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login with {provider.name}
        </button>
      ))}
    </>
  );
};

export default SocialLogin;
