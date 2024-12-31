"use client";
import { AccountContext } from "@/context/AccountProvider";
import { useContext, useEffect } from "react";

const GoogleSignIn = () => {
  const {showOneTab} = useContext(AccountContext);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      console.log("GGSI");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!showOneTab) return null;
  return (
    <>
      {showOneTab && (
        <>
          <div
            id="g_id_onload"
            data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            data-context="signin"
            data-ux_mode="popup"
            data-login_uri={
              process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/google/onetap/"
            }
            data-nonce=""
            data-auto_select="false"
            data-itp_support="true"
          ></div>
          <div
            className="g_id_signin fixed bottom-10 right-10"
            data-type="icon"
            data-shape="circle"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-locale="vi"
          ></div>
        </>
      )}
    </>
  );
};

export default GoogleSignIn;
