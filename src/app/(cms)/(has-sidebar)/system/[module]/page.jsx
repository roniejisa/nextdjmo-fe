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
      <div className="px-4 relative">
        <div className="flex py-4 sticky top-0 z-10 bg-white">
          <div className="flex">
            <h1 className="text-3xl font-bold">{moduleMain.name}</h1>
            {moduleMain?.hasTab && <TabModule tab={moduleMain?.hasTab} />}
          </div>
          <div className="ml-auto flex gap-4">
            <Language module={module} moduleMain={moduleMain} />
            {user?.permissions.includes(`${module}.create`) &&
              !moduleMain?.no_add && (
                <LinkCustom
                  href={`${module}/create`}
                  className={
                    "bg-green-500 text-white flex items-center px-2 py-1 transition-all duration-300 rounded-md hover:bg-green-600"
                  }
                >
                  Thêm
                </LinkCustom>
              )}
          </div>
        </div>
        <HeaderTable />
        <div className="w-[calc(100vw-16px*4)] lg:w-[calc(100vw-16px*4-280px-16px*2)] overflow-x-auto">
          <div className="min-w-[1000px] my-table">
            <div className="flex w-full my-columns">
              <SelectAllRow />
              {fields.map((field, index) => (
                <div
                  key={index + field.name}
                  className="flex-1 py-1 px-2 flex items-center"
                >
                  {field.label ?? field.name}
                </div>
              ))}
              <div className="flex-1 py-1 px-2 flex items-center"></div>
            </div>
            <SkeletonWithChildren
              delay={1000}
              skeletonComponent={[
                ...Array(items.length > 0 ? items.length : 10),
              ].map((item, index) => (
                <div className="flex w-full my-columns" key={index}>
                  {fields.map((field, index) => (
                    <div
                      key={index + field.name}
                      className="flex-1 py-1 px-2 flex items-center"
                    >
                      <Skeleton height="20px"></Skeleton>
                    </div>
                  ))}
                  <div className="flex-1 py-1 px-2 flex items-center">
                    <Skeleton height="20px"></Skeleton>
                  </div>
                </div>
              ))}
            >
              {items.length > 0 ? (
                <>
                  {items.map((item) => (
                    <div className="flex w-full my-columns" key={item._id}>
                      <SelectRow id={item._id} />
                      {fields.map((field) => {
                        const Component = components[field.type];
                        if (!Component) {
                          return field.type + " không tồn tại";
                        }
                        return (
                          <div
                            key={field.name}
                            className="flex-1 py-1 px-2 flex items-center"
                          >
                            <Component
                              value={item[field.name]}
                              items={items}
                              item={item}
                              field={field}
                              module={module}
                            />
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
                <div className={items.length > 0 ? "" : "text-center"}>
                  Không có {moduleMain.name} nào!
                </div>
              )}
            </SkeletonWithChildren>
          </div>
        </div>
        {items.length > 0 ? (
          <Pagination
            page={pageItem}
            limit={limitItem}
            total={total}
            module={module}
            items={items}
            searchParams={propSearchParams}
          />
        ) : (
          ""
        )}
      </div>
      <ActionTable />
    </ModuleProvider>
  );
};

export default Module;
