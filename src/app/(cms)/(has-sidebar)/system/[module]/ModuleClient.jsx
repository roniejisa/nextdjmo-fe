"use client";
import React, { useMemo, useState } from "react";
import { getDataModule } from "./actions";
import Pagination from "@/components/Pagination/Pagination";
import { useParams, useSearchParams } from "next/navigation";
import ModuleProvider from "@/context/cms/ModuleProvider";
import SelectRow from "./components/SelectRow";
import SelectAllRow from "./components/SelectAllRow";
import HeaderTable from "./HeaderTable";
import ActionTable from "./components/ActionTable";
import Skeleton from "@/components/Skeleton/Skeleton";
import { components } from "./components";
import TabModule from "./Tab";
import StartTable from "./StartTable";
import HeaderAction from "./HeaderAction";
import ModuleActions from "./ModuleActions";
import useSWR from "swr";

// Custom hook for module data
const useModuleData = (module, searchParams) => {
  const { limit = 20, page = 1, ...propSearchParams } = searchParams;

  // Create a stable key for SWR
  const swrKey = useMemo(() => {
    if (!module) return null;
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      ...propSearchParams,
    });
    return `module-${module}-${params.toString()}`;
  }, [module, limit, page, propSearchParams]);

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => getDataModule(module, limit, page, propSearchParams),
    {
      dedupingInterval: 0,
    }
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

// Loading component
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

const ModuleClient = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = params.module;

  // Convert URLSearchParams to plain object
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
    moduleData,
    isLoading,
    error,
    mutate,
    limit,
    page,
    propSearchParams,
  } = useModuleData(module, searchParamsObject);

  if (isLoading) {
    return <ModuleLoading />;
  }

  if (error) {
    return <ModuleError />;
  }
  console.log(moduleData)
  let {
    items,
    limit: limitItem,
    page: pageItem,
    fields,
    total,
    actions,
    module: moduleMain,
  } = moduleData;
  const allFields = fields;
  
  fields = fields
    .sort((a, b) => {
      b.sort = b.sort ?? 999999;
      return a.sort - b.sort;
    })
    .filter((item) => {
      item.hidden = item.hidden ?? 0;
      return item.hidden === 0;
    });

  return (
    <ModuleProvider module={module} fields={allFields} data={moduleMain}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Header Section */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                  {moduleMain.name}
                </h1>
                {moduleMain?.hasTab && <TabModule tab={moduleMain?.hasTab} />}
              </div>
              <HeaderAction module={module} moduleMain={moduleMain} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <StartTable module={moduleMain} />
          <HeaderTable />

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
                  <div className="flex items-center min-w-[800px]">
                    <div className="w-12 flex items-center justify-center py-4">
                      <SelectAllRow />
                    </div>
                    {fields.map((field, index) => (
                      <div
                        key={index + field.name}
                        className="flex-1 py-4 px-4 flex items-center min-w-0"
                      >
                        <span className="font-semibold text-slate-700 text-sm tracking-wide uppercase">
                          {field.label ?? field.name}
                        </span>
                      </div>
                    ))}
                    <div className="w-32 py-4 px-4 text-center">
                      <span className="font-semibold text-slate-700 text-sm tracking-wide uppercase">
                        Thao tác
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-100">
                  {items.length > 0 ? (
                    <>
                      {items.map((item, itemIndex) => (
                        <div
                          className="flex items-center min-w-[800px] hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200"
                          key={item._id}
                        >
                          <div className="w-12 flex items-center justify-center py-4">
                            <SelectRow id={item._id} />
                          </div>
                          {fields.map((field) => {
                            const Component = components[field.type];
                            if (!Component) {
                              return (
                                <div
                                  key={field.name}
                                  className="flex-1 py-4 px-4 flex items-center min-w-0"
                                >
                                  <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-1 rounded-md">
                                    {field.type} không tồn tại
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <div
                                key={field.name}
                                className="flex-1 py-4 px-4 flex items-center min-w-0"
                              >
                                <div className="truncate">
                                  <Component
                                    value={item[field.name]}
                                    items={items}
                                    item={item}
                                    field={field}
                                    module={module}
                                  />
                                </div>
                              </div>
                            );
                          })}

                          <ModuleActions
                            actions={actions}
                            module={module}
                            item={item}
                            moduleMain={moduleMain}
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                        <svg
                          className="w-8 h-8 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-600 mb-2">
                        Chưa có dữ liệu
                      </h3>
                      <p className="text-slate-500">
                        Không có {moduleMain.name.toLowerCase()} nào được tìm
                        thấy
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {items.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="bg-white rounded-lg shadow-md border border-slate-200/60 p-2">
                <Pagination
                  page={pageItem}
                  limit={limitItem}
                  total={total}
                  module={module}
                  items={items}
                  searchParams={propSearchParams}
                />
              </div>
            </div>
          )}
        </div>

        <ActionTable />
      </div>
    </ModuleProvider>
  );
};

export default ModuleClient;
