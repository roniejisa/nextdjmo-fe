import Text from "./components/Text";
import ImageComponent from "./components/Image";
import Bool from "./components/Bool";
import Email from "./components/Email";
import { getDataModule, getProfile } from "./actions";
import Pagination from "@/components/Pagination/Pagination";
import { redirect } from "next/navigation";
import Editor from "./components/Editor";
import LinkCustom from "@/packages/translation/Link";
import Slug from "./components/Slug";
import DeleteItem from "./components/buttons/DeleteItem";
import { cache } from "react";
import Phone from "./components/Phone";
import OrderStatus from "./components/OrderStatus";
import PaymentStatus from "./components/PaymentStatus";
import ModuleProvider from "@/context/ModuleProvider";
import SelectRow from "./components/SelectRow";
import SelectAllRow from "./components/SelectAllRow";
import HeaderTable from "./HeaderTable";
import ActionTable from "./components/ActionTable";
import Skeleton from "@/components/Skeleton/Skeleton";
import SkeletonWithChildren from "@/components/Skeleton/SkeletonWithChildren";

const components = {
  text: Text,
  image: ImageComponent,
  bool: Bool,
  email: Email,
  editor: Editor,
  slug: Slug,
  phone: Phone,
  order_status: OrderStatus,
  payment_status: PaymentStatus,
};

const cacheGetDataModule = cache(async (module, limit, page) => {
  return await getDataModule(module, limit, page);
});

export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function generateMetadata({ params }) {
  const { module } = await params;
  const { data } = await cacheGetDataModule(module);
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
  const { data } = await getDataModule(module, limit, page, propSearchParams);
  if (Object.keys(data).length === 0) {
    return redirect("/403");
  }

  let {
    items,
    limit: limitItem,
    page: pageItem,
    fields,
    total,
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
    <ModuleProvider module={module} fields={allFields} user={user} data={moduleMain}>
      <div className="px-4 relative">
        <div className="flex py-4 sticky top-0 z-10 bg-white">
          <h1 className="text-3xl font-bold">{moduleMain.name}</h1>
          <div className="ml-auto">
            {user?.permissions.includes(`${module}.create`) && (
              <LinkCustom
                href={`${module}/create`}
                className={"bg-blue-400 inline-block px-2 py-1 rounded-md"}
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
              className={items.length > 0 ? "" : "text-center"}
              skeletonComponent={[
                ...Array(items.length > 0 ? items.length : 10),
              ].map((item, index) => (
                <div className="flex w-full my-columns">
                  {fields.map((field, index) => (
                    <div
                      key={index + field.name}
                      className="flex-1 py-1 px-2 flex items-center"
                    >
                      <Skeleton height="20px"></Skeleton>
                    </div>
                  ))}
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
                            />
                          </div>
                        );
                      })}
                      <div className="flex-1 py-1 px-2 flex items-center">
                        {user.permissions.includes(`${module}.update`) && (
                          <LinkCustom
                            href={`${module}/${item._id}`}
                            className={
                              "bg-yellow-500 inline-block px-2 py-1 rounded-md"
                            }
                          >
                            Sửa
                          </LinkCustom>
                        )}
                        {user.permissions.includes(`${module}.delete`) && (
                          <DeleteItem
                            item={item}
                            data={moduleMain}
                            module={module}
                          >
                            Xóa
                          </DeleteItem>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>Không có {moduleMain.name} nào!</>
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
