"use client";
import { useContext, useRef, useState } from "react";
import FormFilter from "./FormFilter";
import { ModuleContext } from "@/context/cms/ModuleProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import ExcelIcon from "@/components/Icon/svg/Excel";
import SearchIcon from "@/components/Icon/svg/Search";
import { useNotify } from "@/context/NotifyProvider";
import Upload from "@/components/Icon/svg/Upload";
import TooltipText from "@/components/Tooltip/Text";
import { createStringURL } from "@/utils/client/util";

const HeaderTable = () => {
  const { module, user, selectIds, fields } = useContext(ModuleContext);
  const router = useRouterCustom();

  const notify = useNotify();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const inputSearchRef = useRef(null);
  const [nameSearch, setNameSearch] = useState(() => {
    return (
      fields
        .filter((field) => field.type == "text" && field.name != "_id")
        .sort((a, b) => {
          // Kiểm tra a trước
          if (a.mainSearch == "1") {
            return 1; // a đứng trước
          } else if (a.type == "text") {
            return 1; // a đứng trước
          }

          // Kiểm tra b nếu a không được ưu tiên
          if (b.mainSearch == "1") {
            return 1; // b đứng trước
          } else if (b.type == "text") {
            return 1; // b đứng trước
          }

          // Trường hợp không có điều kiện đặc biệt
          return 0; // a và b ngang bằng, không thay đổi thứ tự
        })[0]?.name || ""
    );
  });

  const handleSubmit = async (form) => {
    const stringSearchParams = createStringURL(searchParams, form);
    router.push(pathname + stringSearchParams, true);
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
    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + module + "/create-rows-with-excel",
      {
        Authorization: `Bearer ${token}`,
      },
      formData,
      "POST"
    );
    if (response.status == 200) {
      notify.changeNotify("success", response.message);
      router.refresh();
    } else {
      notify.changeNotify("error", response.message);
    }
  };
  const uploadFileExcel = async () => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.click();
    inputFile.onchange = changeDataFile;
  };

  const handleChangeFilter = (e) => {
    const stringSearchParams = createStringURL(searchParams, [
      [nameSearch, ""],
    ]);
    router.push(pathname + stringSearchParams, true);
    
    setNameSearch(e.target.value);
    inputSearchRef.current.value = "";
  };

  return (
    <div className="flex w-full items-center gap-4 mt-10 mb-4">
      <select
        className="max-w-[100px] py-2"
        defaultValue={nameSearch}
        onChange={handleChangeFilter}
      >
        {fields
          .filter((field) => field.type == "text" && field.name != "_id")
          .map((field) => {
            return (
              <option key={field.name} value={field.name}>
                {field.label}
              </option>
            );
          })}
      </select>
      <form action={handleSubmit} className="relative flex-1">
        {nameSearch && (
          <>
            <input
              type="text"
              ref={inputSearchRef}
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              placeholder="Tìm kiếm"
              autoComplete="off"
              defaultValue={searchParams.get(nameSearch)}
              name={nameSearch}
            />

            <button className="absolute top-1/2 right-2 transform -translate-y-1/2">
              <SearchIcon />
            </button>
          </>
        )}
      </form>
      <FormFilter />
      <div className="flex">
        <TooltipText label={"Mẫu Excel"}>
          <button
            className="h-[42px] flex justify-center items-center w-[42px] border rounded-md"
            onClick={downloadFileExcel}
          >
            <ExcelIcon />
          </button>
        </TooltipText>
        <TooltipText label={"Thêm nhiều"}>
          <button
            className="ml-2 h-[42px] flex justify-center items-center w-[42px] border rounded-md"
            onClick={uploadFileExcel}
          >
            <Upload />
          </button>
        </TooltipText>
      </div>
    </div>
  );
};

export default HeaderTable;
