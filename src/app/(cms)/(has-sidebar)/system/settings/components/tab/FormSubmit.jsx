"use client";

import { useNotify } from "@/context/NotifyProvider";
import { formSubmitSetting } from "./action";
import LinkCustom from "@/packages/translation/Link";
import { useContext } from "react";
import { CMSContext } from "@/context/cms/CMSProvider";

const FormSubmit = ({ moduleMain, moduleName, children }) => {
  const {profile} = useContext(CMSContext)
  const notify = useNotify();
  const submitData = async (formData) => {
    const body = Object.fromEntries(formData);
    const response = await formSubmitSetting(body);
    if (response.status == 200)
      notify.changeNotify("success", response.message);
  };
  return (
    <form action={submitData}>
      <div className="flex py-4 sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">{moduleMain.name}</h1>
        <div className="ml-auto flex items-center gap-3">
          {profile.permissions.includes(`${moduleName}.create`) && (
            <LinkCustom
              href={`${moduleName}/create`}
              className="group relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200 rounded-lg shadow-sm hover:from-amber-100 hover:to-yellow-200 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
            >
              <svg
                className="w-4 h-4 mr-2 text-amber-600 group-hover:text-amber-700 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm mới
            </LinkCustom>
          )}
          <button className="group relative inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 border border-transparent rounded-lg shadow-sm hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95">
            <svg
              className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Lưu lại
            <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>
      {children}
    </form>
  );
};

export default FormSubmit;
