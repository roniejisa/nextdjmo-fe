"use client";
import { useEffect, useState } from "react";
import { handleSaveToken } from "./action";

const CallbackOAuth = ({ searchParams }) => {
  const [status, setStatus] = useState("processing"); // processing, success, error

  const saveToken = async () => {
    try {
      const token = searchParams.token;
      const refreshToken = searchParams.refreshToken;
      const created = searchParams.created;
      const redirect = searchParams.redirect;
      
      const data = await handleSaveToken(token, refreshToken);
      const channel = new BroadcastChannel("login-channel");
      
      if (data) {
        setStatus("success");
        channel.postMessage({ type: "login-social-success", created, redirect });
        
        // Đóng cửa sổ sau 2 giây để người dùng thấy thông báo thành công
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        setStatus("error");
        channel.postMessage({ type: "login-social-fail" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus("error");
      const channel = new BroadcastChannel("login-channel");
      channel.postMessage({ type: "login-social-fail" });
    }
  };

  useEffect(() => {
    saveToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        {status === "processing" && (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đang đăng nhập...
            </h2>
            <p className="text-gray-600">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        )}
        
        {status === "success" && (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đăng nhập thành công!
            </h2>
            <p className="text-gray-600">
              Cửa sổ sẽ tự động đóng...
            </p>
          </div>
        )}
        
        {status === "error" && (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đăng nhập thất bại
            </h2>
            <p className="text-gray-600 mb-4">
              Có lỗi xảy ra trong quá trình đăng nhập
            </p>
            <button
              onClick={() => window.close()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallbackOAuth;