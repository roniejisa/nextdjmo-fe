"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { handleSaveToken } from "./action";

const CallbackPage = () => {
  const params = useSearchParams();
  
  const saveToken = async () => {
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const created = params.get("created");
    const redirect = params.get("redirect");
    const data = await handleSaveToken(token, refreshToken);
    const channel = new BroadcastChannel("login-channel");
    if (data) {
      channel.postMessage({ type: "login-social-success", created, redirect });
    }else{
      channel.postMessage({ type: "login-social-fail" });        
    }
    window.close();
  };
  useEffect(() => {
    saveToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>Đang đăng nhập...</div>;
};

export default CallbackPage;
