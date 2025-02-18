"use client";

import { AllContext } from "@/context/cms/AllProvider";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { useContext, useState } from "react";
import { confirmOtp, disabledOtp, enableOtp } from "../actions";
import Image from "next/image";

const TwoFA = ({ field, defaultValue, item, profile }) => {
  const { setShowModalQuestion, setModalOptions } = useContext(AllContext);
  const [on2Fa, setOn2Fa] = useState(defaultValue);
  const router = useRouterCustom();
  const notify = useNotify();
  const handleOn2FA = () => {
    setShowModalQuestion(true);
    setModalOptions(on2FAObj);
  };

  const on2FAObj = {
    title: "Vui lòng nhập mật khẩu để mở 2FA!",
    component: (
      <input
        className="py-2 px-4"
        autoComplete="off"
        type="password"
        name="password"
        placeholder="Nhập mật khẩu của tài khoản"
      />
    ),
    confirm: async (form) => {
      const body = Object.fromEntries(form);
      body.customer_id = item._id;
      const response = await enableOtp(body);
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
        <Image
          src={`data:image/png;base64,${response.data.image}`}
          width={500}
          height={500}
          alt="QR"
        />
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
      <input
        className="py-2 px-4"
        autoComplete="off"
        type="text"
        name="code"
        placeholder="Nhập mã OTP để xác nhận bật"
      />
    ),
    confirm: async (form) => {
      const body = Object.fromEntries(form);
      body.customer_id = item._id;
      const response = await confirmOtp(body);
      if (response.status == 200) {
        setShowModalQuestion(false);
        setOn2Fa("active");
        notify.changeNotify("success", response?.message || "Thành công!");
      } else {
        notify.changeNotify("error", response?.message || "Thành công!");
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
      <input
        type="text"
        name="code"
        autoComplete="off"
        placeholder="Mã OTP 2FA"
        className="py-2 px-4"
      />
    ),
    confirm: async (form) => {
      const body = Object.fromEntries(form);
      body.customer_id = item._id;
      const response = await disabledOtp(body);
      if (response.status == 200) {
        setShowModalQuestion(false);
        setOn2Fa("unactive");
        notify.changeNotify("success", response?.message || "Thành công!");
      } else {
        notify.changeNotify("error", response?.message || "Thành công!");
      }
      return false;
    },
  };
  if (profile.user._id !== item._id) {
    return (
      <span className="text-red-500">
        Chức năng này chỉ tài khoản đăng nhập đúng mới xem được
      </span>
    );
  }
  return (
    <div>
      {on2Fa === "unactive" ? (
        <button
          type="button"
          className="bg-yellow-500 p-4 rounded-md"
          onClick={handleOn2FA}
        >
          Bật 2FA
        </button>
      ) : (
        <button
          type="button"
          className="bg-red-500 text-white p-4 rounded-md"
          onClick={handleOff2FA}
        >
          Tắt 2FA
        </button>
      )}
    </div>
  );
};

export default TwoFA;
