"use client";
import { useContext } from "react";
import FormFilter from "./FormFilter";
import { ModuleContext } from "@/context/ModuleProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";

const HeaderTable = () => {
  const { module, user, selectIds, fields } = useContext(ModuleContext);
  const router = useRouterCustom();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const nameSearch = fields.sort((a, b) => {
    // Kiểm tra a trước
    if (a.mainSearch == "1") {
      return -1; // a đứng trước
    } else if (a.type == "text") {
      return -1; // a đứng trước
    }

    // Kiểm tra b nếu a không được ưu tiên
    if (b.mainSearch == "1") {
      return 1; // b đứng trước
    } else if (b.type == "text") {
      return 1; // b đứng trước
    }

    // Trường hợp không có điều kiện đặc biệt
    return 0; // a và b ngang bằng, không thay đổi thứ tự
  })[0];

  const handleSubmit = async (form) => {
    const searchParams = new URLSearchParams(Object.fromEntries(form));
    router.replace(pathname + "?" + searchParams.toString());
  };
  return (
    <div className="flex w-full gap-4 mt-10 mb-4">
      <form action={handleSubmit} className="relative flex-1">
        <input
          type="text"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
          placeholder="Tìm kiếm"
          autoComplete="false"
          defaultValue={searchParams.get(nameSearch.name)}
          name={nameSearch.name}
        />
        <button className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
        </button>
      </form>
      <FormFilter />
    </div>
  );
};

export default HeaderTable;
