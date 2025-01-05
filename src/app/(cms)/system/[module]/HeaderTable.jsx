"use client";
import { useContext } from "react";
import FormFilter from "./FormFilter";
import { ModuleContext } from "@/context/ModuleProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

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
    const newSeachParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(form),
    });
    router.push(pathname + "?" + newSeachParams.toString());
  };

  const downloadFileExcel = async () => {
    const token = await getToken();
    const response = fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL +
        module +
        "/download-file-excel-example",
      {
        headers: {
          "X-API-KEY": 123456,
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob); // Tạo URL cho file
        const a = document.createElement("a"); // Tạo thẻ <a>
        a.href = url;
        a.download = "output.xlsx"; // Tên file tải xuống
        document.body.appendChild(a);
        a.click(); // Tự động click để tải xuống
        a.remove(); // Xóa thẻ <a> sau khi tải
        window.URL.revokeObjectURL(url); // Hủy URL
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });
  };

  const changeDataFile = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
    const token = await getToken();
    const formData = new FormData();
    formData.append("file_excel", file);
    const response = await fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + module + "/create-rows-with-excel",
      {
        headers: {
          "X-API-KEY": 123456,
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }
    );
  };
  const uploadFileExcel = async () => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.click();
    inputFile.onchange = changeDataFile;
  };
  return (
    <div className="flex w-full gap-4 mt-10 mb-4">
      <form action={handleSubmit} className="relative flex-1">
        {nameSearch && (
          <>
            <input
              type="text"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              placeholder="Tìm kiếm"
              autoComplete="false"
              defaultValue={searchParams.get(nameSearch?.name)}
              name={nameSearch?.name}
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
          </>
        )}
      </form>
      <FormFilter />
      <button className="ml-2 h-[42px] w-[42px]" onClick={downloadFileExcel}>
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
          className=""
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
          <path d="M4 15l4 6" />
          <path d="M4 21l4 -6" />
          <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
          <path d="M11 15v6h3" />
        </svg>
      </button>
      <button className="ml-2 h-[42px] w-[42px]" onClick={uploadFileExcel}>
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
          className=""
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
          <path d="M4 15l4 6" />
          <path d="M4 21l4 -6" />
          <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
          <path d="M11 15v6h3" />
        </svg>
      </button>
    </div>
  );
};

export default HeaderTable;
