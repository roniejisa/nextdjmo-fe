import { notFound } from "next/navigation";
import LinkCustom from "@/packages/translation/Link";
import { getDataModule } from "./actions";
import SettingComponent from "./components/tab/SettingComponent";
import FormSubmit from "./components/tab/FormSubmit";
import { cache } from "react";

const cacheGetDataModule = cache(async (module) => {
  return await getDataModule(module);
});

export async function generateMetadata() {
  return {
    title: "Cài đặt chung",
    robots: "noindex, nofollow",
  };
}

const Module = async () => {
  const moduleName = "settings";
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
      <FormSubmit moduleMain={moduleMain} moduleName={moduleName}>
        <SettingComponent data={data} />
      </FormSubmit>
    </div>
  );
};

export default Module;
