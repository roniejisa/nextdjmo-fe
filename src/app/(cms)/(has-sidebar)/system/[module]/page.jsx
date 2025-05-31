import { getDataModule, getProfile } from "./actions";
import Pagination from "@/components/Pagination/Pagination";
import { redirect } from "next/navigation";
import LinkCustom from "@/packages/translation/Link";
import { cache } from "react";
import ModuleProvider from "@/context/cms/ModuleProvider";
import SelectRow from "./components/SelectRow";
import SelectAllRow from "./components/SelectAllRow";
import HeaderTable from "./HeaderTable";
import ActionTable from "./components/ActionTable";
import Skeleton from "@/components/Skeleton/Skeleton";
import SkeletonWithChildren from "@/components/Skeleton/SkeletonWithChildren";
import Language from "./components/buttons/Language";
import { componentActions, components } from "./components";
import TabModule from "./Tab";
import StartTable from "./StartTable";

const cacheGetDataModule = cache(async (module, limit, page, searchParams) => {
  return await getDataModule(module, limit, page, searchParams);
});

export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function generateMetadata({ params, searchParams }) {
  const { module } = await params;
  const { data } = await cacheGetDataModule(
    module,
    undefined,
    undefined,
    searchParams
  );
  if (Object.keys(data).length === 0) redirect("/403");
  let { module: moduleMain } = data;
  return {
    title: moduleMain.name,
  };
}

const Module = async ({ params, searchParams }) => {
  const { module } = await params;
  const { limit, page, ...propSearchParams } = await searchParams;
  const user = await getProfile();
  const response = await getDataModule(module, limit, page, propSearchParams);
  const data = response?.data ?? {};
  if (Object.keys(data).length === 0) {
    return redirect("/403");
  }

  let {
    items,
    limit: limitItem,
    page: pageItem,
    fields,
    total,
    actions,
    module: moduleMain,
  } = data;
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
    <ModuleProvider
      module={module}
      fields={allFields}
      user={user}
      data={moduleMain}
    >
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

              <div className="flex items-center gap-3 sm:ml-auto">
                <Language module={module} moduleMain={moduleMain} />
                {user?.permissions.includes(`${module}.create`) &&
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
                  <SkeletonWithChildren
                    delay={1000}
                    skeletonComponent={[
                      ...Array(items.length > 0 ? items.length : 10),
                    ].map((item, index) => (
                      <div
                        className="flex items-center min-w-[800px] hover:bg-slate-50/50 transition-colors duration-200"
                        key={index}
                      >
                        <div className="w-12 flex items-center justify-center py-4">
                          <Skeleton
                            height="16px"
                            width="16px"
                            className="rounded"
                          ></Skeleton>
                        </div>
                        {fields.map((field, fieldIndex) => (
                          <div
                            key={fieldIndex + field.name}
                            className="flex-1 py-4 px-4 flex items-center min-w-0"
                          >
                            <Skeleton
                              height="20px"
                              className="rounded-md"
                            ></Skeleton>
                          </div>
                        ))}
                        <div className="w-32 py-4 px-4 flex items-center justify-center gap-2">
                          <Skeleton
                            height="20px"
                            width="60px"
                            className="rounded-md"
                          ></Skeleton>
                        </div>
                      </div>
                    ))}
                  >
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

                            <div className="flex-1 py-1 px-2 gap-2 flex items-center">
                              {actions.map((action, index) => {
                                if (
                                  user.permissions.includes(
                                    `${module}.${action.permission}`
                                  )
                                ) {
                                  const ComponentAction =
                                    componentActions[action.type];
                                  return (
                                    <ComponentAction
                                      item={item}
                                      data={moduleMain}
                                      module={module}
                                      action={action}
                                      key={index}
                                      href={`${module}/${item._id}`}
                                    >
                                      {action.svg}
                                    </ComponentAction>
                                  );
                                }
                                return null;
                              })}
                            </div>
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
                  </SkeletonWithChildren>
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

export default Module;
