"use client";
import React, { useMemo } from "react";
import { getDataModule } from "./actions";
import Pagination from "@/components/Pagination/Pagination";
import { useParams, useSearchParams } from "next/navigation";
import ModuleProvider from "@/context/cms/ModuleProvider";
import SelectRow from "./fields/SelectRow";
import SelectAllRow from "./fields/SelectAllRow";
import HeaderTable from "./HeaderTable";
import ActionTable from "./fields/ActionTable";
import { components } from "./components";
import TabModule from "./Tab";
import StartTable from "./StartTable";
import HeaderAction from "./HeaderAction";
import ModuleActions from "./ModuleActions";
import useSWR from "swr";
import { ModuleLoadingTable } from "./components/Loading";
import { ModuleError } from "./components/Error";

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
    return <ModuleLoadingTable />;
  }

  if (error) {
    return <ModuleError />;
  }
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
                                    mutate={mutate}
                                  />
                                </div>
                              </div>
                            );
                          })}

                          <ModuleActions
                            mutate={mutate}
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

        <ActionTable mutate={mutate} />
      </div>
    </ModuleProvider>
  );
};

export default ModuleClient;
