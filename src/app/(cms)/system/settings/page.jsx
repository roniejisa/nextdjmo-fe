import { notFound } from "next/navigation";
import LinkCustom from "@/packages/translation/Link";
import { getDataModule } from "./actions";
import SettingComponent from "./components/tab/SettingComponent";
import FormSubmit from "./components/tab/FormSubmit";
import { cache } from "react";
import { getProfile } from "../[module]/actions";

const cacheGetDataModule = cache(async (module) => {
  return await getDataModule(module);
});
export async function generateMetadata({ params, searchParams }, parent) {
  const moduleName = "settings";
  const { data } = await cacheGetDataModule(moduleName);
  if (!data) {
    return notFound();
  }
  let { module: moduleMain } = data || {};
  return {
    title: moduleMain.name,
  };
}

const Module = async ({profile}) => {
  const moduleName = "settings";
  const user = await getProfile();
  const { data } = await cacheGetDataModule(moduleName);

  if (!data) {
    return notFound();
  }

  let {
    items,
    limit: limitItem,
    page: pageItem,
    fields,
    total,
    module: moduleMain,
  } = data || {};

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
    <div className="px-4">
      <FormSubmit>
        <div className="flex py-4 sticky top-0 z-10 bg-white">
          <h1 className="text-3xl font-bold">{moduleMain.name}</h1>
          <div className="ml-auto">
            {user.permissions.includes(`${moduleName}.create`) && (
              <LinkCustom
                href={`${moduleName}/create`}
                className={"bg-yellow-500 inline-block px-2 py-1 rounded-md mr-2"}
              >
                Thêm
              </LinkCustom>
            )}
            <button className="bg-green-500 text-white inline-block px-2 py-1 rounded-md">Lưu lại</button>
          </div>
        </div>          
        <SettingComponent data={data} />
      </FormSubmit>
    </div>
  );
};

export default Module;
