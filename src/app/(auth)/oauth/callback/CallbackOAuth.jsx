"use client";
import { useEffect } from "react";
import { handleSaveToken } from "./action";
const CallbackOAuth = ({ searchParams }) => {
  const saveToken = async () => {
    const token = searchParams.token;
    const refreshToken = searchParams.refreshToken;
    const created = searchParams.created;
    const redirect = searchParams.redirect;
    const data = await handleSaveToken(token, refreshToken);
    const channel = new BroadcastChannel("login-channel");
    if (data) {
      channel.postMessage({ type: "login-social-success", created, redirect });
    } else {
      channel.postMessage({ type: "login-social-fail" });
    }
    window.close();
  };
  useEffect(() => {
    saveToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>CallbackOAuth</div>;
};

export default CallbackOAuth;
