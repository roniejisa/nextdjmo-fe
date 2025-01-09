import React from "react";
import FormLogin from "./FormLogin";
import SocialLogin from "./SocialLogin";
import { cookies } from "next/headers";
import ImageCustom from "@/components/Maintain/Image";
import Logo from "@/components/Icon/Logo";
// import BackButton from "@/components/BackButton/BackButton";

const LoginPage = async ({ searchParams }) => {
  const msg = cookies().get("msg")?.value;
  const storeSeachParams = await searchParams;
  const { redirect } = storeSeachParams;
  return (
    <>
      {/* <BackButton /> */}
      <div className="lg:flex">
        <div className="w-full flex justify-center px-4 flex-[0_0_calc(100%-400px)]">
          <div className="h-screen flex items-center justify-center max-w-xl w-full">
            <div className="w-full">
              <div className="bg-white py-12 px-4">
                <Logo className="w-[80px] h-[60px]" />
                <h1 className="text-3xl mb-2 font-bold mt-10">
                  Chào mừng trở lại!
                </h1>
                <p className="text-md font-medium">Vui lòng nhập thông tin đăng nhập của bạn để đăng nhập!</p>
                <FormLogin msg={msg} redirect={redirect} />
                <SocialLogin redirect={redirect} />
              </div>
            </div>
          </div>
        </div>
        <ImageCustom
          src={"/auth-bg.png"}
          className="fixed hidden lg:block bottom-0 z-[-1] h-screen w-full object-contain right-0 translate-x-[45%]"
          width={0}
          height={0}
          alt="auth"
        />
      </div>
    </>
  );
};

export default LoginPage;
