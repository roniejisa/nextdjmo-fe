"use client";
import { useEffect } from "react";
const CallbackOAuth = ({ params }) => {
  const saveToken = async () => {
    const token = params.token;
    const refreshToken = params.refreshToken;
    const created = params.created;
    const redirect = params.redirect;
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
