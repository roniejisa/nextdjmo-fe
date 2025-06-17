"use client";
import LinkCustom from "@/packages/translation/Link";
import React, { useContext } from "react";
import Language from "./fields/Language";
import { CMSContext } from "@/context/cms/CMSProvider";

const HeaderAction = ({moduleMain, module}) => {
  const { profile } = useContext(CMSContext);
  return (
    <div className="flex items-center gap-3 sm:ml-auto">
      <Language module={module} moduleMain={moduleMain} />
      {profile?.permissions.includes(`${module}.create`) &&
        !moduleMain?.no_add && (
          <LinkCustom
            href={`${module}/create`}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <svg
              className="w-4 h-4 mr-2"
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
    </div>
  );
};

export default HeaderAction;
