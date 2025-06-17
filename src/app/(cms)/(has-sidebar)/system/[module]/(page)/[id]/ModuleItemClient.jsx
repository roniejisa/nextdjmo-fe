"use client";

import { useParams, useSearchParams } from "next/navigation";
import FormUpdate from "./FormUpdate";
import { moduleDetail } from "./actions";
import Skeleton from "@/components/Skeleton/Skeleton";
import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import useRouterCustom from "@/packages/translation/Navigation";
const useModuleItemData = (module, id, searchParams) => {
  const { limit = 20, page = 1, ...propSearchParams } = searchParams;

  // Create a stable key for SWR
  const swrKey = useMemo(() => {
    if (!module) return null;
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      ...propSearchParams,
    });
    return `module-${module}-${id}-${params.toString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propSearchParams]);

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => moduleDetail(module, id, propSearchParams.language ?? null),
    {}
  );

  return {
    moduleData: data?.data || {},
    isLoading,
    error,
    mutate,
    limit,
    page,
    propSearchParams,
  };
};
const ModuleLoading = ({ fieldsCount = 5 }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Skeleton height="32px" width="200px" className="rounded-md" />
            </div>
            <div className="ml-auto">
              <Skeleton height="40px" width="120px" className="rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header Skeleton */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
                <div className="flex items-center min-w-[800px]">
                  <div className="w-12 flex items-center justify-center py-4">
                    <Skeleton height="16px" width="16px" className="rounded" />
                  </div>
                  {Array.from({ length: fieldsCount }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 py-4 px-4 flex items-center min-w-0"
                    >
                      <Skeleton
                        height="20px"
                        width="80px"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                  <div className="w-32 py-4 px-4 text-center">
                    <Skeleton
                      height="20px"
                      width="60px"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Table Body Skeleton */}
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center min-w-[800px] hover:bg-slate-50/50 transition-colors duration-200"
                  >
                    <div className="w-12 flex items-center justify-center py-4">
                      <Skeleton
                        height="16px"
                        width="16px"
                        className="rounded"
                      />
                    </div>
                    {Array.from({ length: fieldsCount }).map(
                      (_, fieldIndex) => (
                        <div
                          key={fieldIndex}
                          className="flex-1 py-4 px-4 flex items-center min-w-0"
                        >
                          <Skeleton height="20px" className="rounded-md" />
                        </div>
                      )
                    )}
                    <div className="w-32 py-4 px-4 flex items-center justify-center gap-2">
                      <Skeleton
                        height="20px"
                        width="60px"
                        className="rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error component
const ModuleError = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-slate-600 mb-4">
            {error?.message || "Không thể tải dữ liệu. Vui lòng thử lại."}
          </p>
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
};

const ModuleItemClient = () => {
  console.log("CHECK");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouterCustom();
  const { id, module } = params;
  const hasRedirected = useRef(false);

  const searchParamsObject = useMemo(() => {
    const obj = {};
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        obj[key] = value;
      }
    }
    return obj;
  }, [searchParams]);

  const {
    moduleData: data,
    isLoading,
    error,
    mutate,
    limit,
    page,
    propSearchParams,
  } = useModuleItemData(module, id, searchParamsObject);

  // DI CHUYỂN useEffect LÊN TRƯỚC CÁC EARLY RETURN
  useEffect(() => {
    // Chỉ chạy khi data đã load và không bị lỗi
    if (isLoading || error || hasRedirected.current || !data) return;

    const { module: moduleStore } = data;
    const language = searchParamsObject.language ?? null;
    const isMultiple = moduleStore?.language ?? false;

    if (
      isMultiple &&
      Array.isArray(moduleStore?.langs) &&
      (!language || !moduleStore.langs.find((item) => item?.code === language))
    ) {
      hasRedirected.current = true;
      router.push(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          `${module}/${id}?language=${moduleStore.default_lang}`
      );
    }
  }, [isLoading, error, data, searchParamsObject.language, module, id, router]);

  // CÁC EARLY RETURN SAU useEffect
  if (isLoading) {
    return <ModuleLoading />;
  }

  if (error) {
    return <ModuleError error={error} onRetry={() => mutate()} />;
  }

  let { item, fields, module: moduleStore } = data;

  fields = fields.filter((field) => {
    field.hiddenForm = field.hiddenForm ?? 0;
    return field.hiddenForm === 0;
  });

  return (
    <FormUpdate
      item={item}
      module={module}
      id={id}
      fields={fields}
      moduleStore={moduleStore}
      searchParams={searchParams}
    />
  );
};

export default ModuleItemClient;
