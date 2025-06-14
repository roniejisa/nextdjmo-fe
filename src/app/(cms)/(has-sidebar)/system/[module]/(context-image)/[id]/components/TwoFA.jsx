"use client";

import { CMSContext } from "@/context/cms/CMSProvider";
import { useNotify } from "@/context/NotifyProvider";
import { useContext, useState } from "react";
import { confirmOtp, disabledOtp, enableOtp } from "../actions";
import Image from "next/image";

const TwoFA = ({ defaultValue, item }) => {
  const { setShowModalQuestion, setModalOptions, profile } = useContext(CMSContext);
  const [on2Fa, setOn2Fa] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotify();
  const handleOn2FA = () => {
    setShowModalQuestion(true);
    setModalOptions(on2FAObj);
  };

  const on2FAObj = {
    title: "Vui lòng nhập mật khẩu để mở 2FA!",
    component: (
      <div className="p-6">
        <div className="relative">
          <input
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
            autoComplete="off"
            type="password"
            name="password"
            placeholder="Nhập mật khẩu của tài khoản"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>
    ),
    confirm: async (form) => {
      setIsLoading(true);
      const body = Object.fromEntries(form);
      body.customer_id = item._id;
      const response = await enableOtp(body);
      setIsLoading(false);
      if (response.status == 200) {
        setModalOptions(qrObj(response));
        notify.changeNotify("success", response?.message || "Thành công!");
      } else {
        notify.changeNotify("error", response?.message || "Không thành công!");
      }
      return false;
    },
  };

  const qrObj = (response) => {
    return {
      title: "Quét mã QR",
      component: (
        <div className="p-6 text-center">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Sử dụng ứng dụng xác thực để quét mã QR</p>
            <p className="text-sm text-gray-500">Google Authenticator, Authy, hoặc ứng dụng tương tự</p>
          </div>
          <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
            <Image
              src={`data:image/png;base64,${response.data.image}`}
              width={200}
              height={200}
              alt="QR Code"
              className="mx-auto"
            />
          </div>
        </div>
      ),
      confirm: async () => {
        setModalOptions(verifyObj);
      },
      btnAccept: "Xác nhận mã",
    };
  };

  const verifyObj = {
    title: "Nhập mã OTP để xác nhận",
    component: (
      <div className="p-6">
        <div className="mb-4 text-center">
          <p className="text-gray-600">Nhập mã 6 chữ số từ ứng dụng xác thực</p>
        </div>
        <div className="relative">
          <input
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-center text-lg font-mono tracking-widest"
            autoComplete="off"
            type="text"
            name="code"
            placeholder="000000"
            maxLength="6"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    ),
    confirm: async (form) => {
      setIsLoading(true);
      const body = Object.fromEntries(form);
      body.customer_id = item._id;
      const response = await confirmOtp(body);
      setIsLoading(false);
      if (response.status == 200) {
        setShowModalQuestion(false);
        setOn2Fa("active");
        notify.changeNotify("success", response?.message || "Thành công!");
      } else {
        notify.changeNotify("error", response?.message || "Không thành công!");
      }
    },
  };

  const handleOff2FA = () => {
    setShowModalQuestion(true);
    setModalOptions(off2FAObj);
  };

  const off2FAObj = {
    title: "Nhập mã OTP để tắt xác nhận bước 2?",
    component: (
      <div className="p-6">
        <div className="mb-4 text-center">
          <p className="text-gray-600">Nhập mã OTP để tắt bảo mật 2 lớp</p>
        </div>
        <div className="relative">
          <input
            type="text"
            name="code"
            autoComplete="off"
            placeholder="000000"
            maxLength="6"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-center text-lg font-mono tracking-widest"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    ),
    confirm: async (form) => {
      setIsLoading(true);
      const body = Object.fromEntries(form);
      body.customer_id = item._id;
      const response = await disabledOtp(body);
      setIsLoading(false);
      if (response.status == 200) {
        setShowModalQuestion(false);
        setOn2Fa("unactive");
        notify.changeNotify("success", response?.message || "Thành công!");
      } else {
        notify.changeNotify("error", response?.message || "Không thành công!");
      }
      return false;
    },
  };

  if (profile.user._id !== item._id) {
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Quyền truy cập bị hạn chế</h3>
            <p className="text-sm text-red-700 mt-1">
              Chức năng này chỉ tài khoản đăng nhập đúng mới xem được
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Xác thực 2 lớp (2FA)</h3>
            <p className="text-sm text-gray-600">
              {on2Fa === "active" ? "Đang được bảo vệ" : "Chưa được bảo vệ"}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${on2Fa === "active" ? "bg-green-500" : "bg-gray-400"} mr-2`}></div>
          <span className={`text-sm font-medium ${on2Fa === "active" ? "text-green-600" : "text-gray-500"}`}>
            {on2Fa === "active" ? "Đã kích hoạt" : "Chưa kích hoạt"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Về xác thực 2 lớp</h4>
              <p className="text-sm text-gray-600">
                {on2Fa === "active" 
                  ? "Tài khoản của bạn được bảo vệ bằng lớp bảo mật bổ sung. Bạn sẽ cần nhập mã từ ứng dụng xác thực khi đăng nhập."
                  : "Thêm một lớp bảo mật cho tài khoản của bạn. Khi bật, bạn sẽ cần nhập mã từ ứng dụng xác thực mỗi khi đăng nhập."
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {on2Fa === "unactive" ? (
            <button
              type="button"
              disabled={isLoading}
              className="group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              onClick={handleOn2FA}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Bật 2FA</span>
                </div>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              className="group relative px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              onClick={handleOff2FA}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Tắt 2FA</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFA;