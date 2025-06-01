import { notFound } from "next/navigation";
import { cache } from "react";
import { getDataModule, getProfile } from "../[module]/actions";
import { getToken } from "@/utils/server/utils";
import MenuBuilder from "@/packages/menu_builder/MenuBuilder";

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

const LinkBuilder = async ({}) => {
  const moduleName = "links";
  const user = await getProfile();
  const { data } = await cacheGetDataModule(moduleName);
  const token = await getToken();
  if (!data) {
    return notFound();
  }

  let { module: moduleMain, items } = data || {};
  return (
    <>
      <MenuBuilder data={data} moduleMain={moduleMain} items={items}/>
    </>
  );
};

export default LinkBuilder;
