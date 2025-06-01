"use client";

import {
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import FormFilter from "./FormFilter";
import { ModuleContext } from "@/context/cms/ModuleProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { useNotify } from "@/context/NotifyProvider";
import { createQueryString } from "@/utils/client";
import ExcelIcon from "@/components/Icon/svg/Excel";
import SearchIcon from "@/components/Icon/svg/Search";
import Upload from "@/components/Icon/svg/Upload";
import TooltipText from "@/components/Tooltip/Text";
import { SearchFieldSelector } from "@/packages/select-super/SelectSuper";

const FORM_CONTROL_CLASSES =
  "px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all duration-200 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-[42px]";

const SearchInput = ({ searchField, searchParams, inputRef, onSubmit }) => {
  if (!searchField) return null;

  return (
    <form action={onSubmit} className="relative flex-1 max-w-lg">
      <input
        type="text"
        ref={inputRef}
        name={searchField}
        className={`${FORM_CONTROL_CLASSES} w-full pl-4 pr-12 bg-white placeholder-gray-400 min-w-[300px]`}
        placeholder="Tìm kiếm..."
        autoComplete="off"
        defaultValue={searchParams.get(searchField) || ""}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2
                   p-1.5 rounded-md hover:bg-gray-100 transition-colors
                   text-gray-500 hover:text-gray-700"
        aria-label="Search"
      >
        <SearchIcon className="w-4 h-4" />
      </button>
    </form>
  );
};
// Action button component
const ActionButton = ({ onClick, icon: Icon, label, variant = "default" }) => {
  const baseClasses = `
    h-10 w-10 flex items-center justify-center rounded-lg border
    transition-all duration-200 focus:outline-none focus:ring-2
    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    default: `
      border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400
      text-gray-600 hover:text-gray-700 focus:ring-blue-500
    `,
    primary: `
      border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400
      text-blue-600 hover:text-blue-700 focus:ring-blue-500
    `,
  };

  return (
    <TooltipText label={label}>
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]}`}
        aria-label={label}
      >
        <Icon className="w-5 h-5" />
      </button>
    </TooltipText>
  );
};

// Action buttons group component
const ActionButtonsGroup = ({ onDownloadExcel, onUploadExcel }) => (
  <div className="flex items-center gap-2">
    <ActionButton
      onClick={onDownloadExcel}
      icon={ExcelIcon}
      label="Tải mẫu Excel"
      variant="default"
    />
    <ActionButton
      onClick={onUploadExcel}
      icon={Upload}
      label="Upload Excel"
      variant="primary"
    />
  </div>
);

// Custom hooks
const useSearchField = (fields) => {
  return useMemo(() => {
    const textFields = fields.filter(
      (field) => field.type === "text" && field.name !== "_id"
    );

    // Sort by priority: mainSearch first, then text fields
    const sortedFields = textFields.sort((a, b) => {
      if (a.mainSearch === "1" && b.mainSearch !== "1") return -1;
      if (b.mainSearch === "1" && a.mainSearch !== "1") return 1;
      return 0;
    });

    return sortedFields[0]?.name || null;
  }, [fields]);
};

const useExcelOperations = (module, notify, router) => {
  const downloadExcel = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/download-file-excel-example`,
        {
          method: "POST",
          headers: {
            "X-API-KEY": "123456",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "template.xlsx";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      notify.changeNotify("error", "Không thể tải xuống file mẫu");
    }
  }, [module, notify]);

  const uploadExcel = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const token = await getToken();
        const formData = new FormData();
        formData.append("file_excel", file);

        const response = await httpClient(
          `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/create-rows-with-excel`,
          { Authorization: `Bearer ${token}` },
          formData,
          "POST"
        );

        if (response.status === 200) {
          notify.changeNotify("success", response.message);
          router.refresh();
        } else {
          notify.changeNotify("error", response.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        notify.changeNotify("error", "Không thể upload file");
      }
    };

    input.click();
  }, [module, notify, router]);

  return { downloadExcel, uploadExcel };
};

// Main component
const HeaderTable = () => {
  const { module, fields } = useContext(ModuleContext);
  const router = useRouterCustom();
  const notify = useNotify();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const inputSearchRef = useRef(null);

  const defaultSearchField = useSearchField(fields);
  const [nameSearch, setNameSearch] = useState(defaultSearchField);
  const { downloadExcel, uploadExcel } = useExcelOperations(
    module,
    notify,
    router
  );

  const handleSubmit = useCallback(
    async (formData) => {
      const form = Array.from(formData.entries());
      const queryString = createQueryString(searchParams, form, { page: 1 });
      router.push(pathname + queryString);
      router.refresh();
    },
    [searchParams, pathname, router]
  );

  const handleSearchFieldChange = useCallback(
    (newField) => {
      const queryString = createQueryString(searchParams, [[nameSearch, ""]], {
        page: 1,
      });
      router.push(pathname + queryString);
      setNameSearch(newField);

      if (inputSearchRef.current) {
        inputSearchRef.current.value = "";
      }
    },
    [nameSearch, searchParams, pathname, router]
  );

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
      <SearchFieldSelector
        fields={fields}
        selectedField={nameSearch}
        onChange={handleSearchFieldChange}
        className={`${FORM_CONTROL_CLASSES} border border-gray-300 w-full pl-4 pr-4 bg-white placeholder-gray-400 min-w-[160px]`}
        placeholder="Chọn"
      />

      <SearchInput
        searchField={nameSearch}
        searchParams={searchParams}
        inputRef={inputSearchRef}
        onSubmit={handleSubmit}
      />

      <FormFilter />

      <ActionButtonsGroup
        onDownloadExcel={downloadExcel}
        onUploadExcel={uploadExcel}
      />
    </div>
  );
};

export default HeaderTable;
