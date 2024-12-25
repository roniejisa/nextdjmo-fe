import React from "react";
import FormLogin from "./FormLogin";
// import BackButton from "@/components/BackButton/BackButton";

const LoginPage = () => {
  return (
    <>
      {/* <BackButton /> */}
      <div className="w-full flex justify-center px-4">
        <div className="h-screen flex items-center justify-center max-w-xl w-full">
          <div className="text-center w-full">
            <div className="bg-white py-12 px-4 shadow-md rounded-lg">
              <h1 className="text-3xl mb-4 font-bold">Đăng nhập</h1>
              <FormLogin />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
