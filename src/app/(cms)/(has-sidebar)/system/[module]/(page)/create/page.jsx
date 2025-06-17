export const dynamic = "force-dynamic";
export const revalidate = 0;
import React from "react";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDataModule } from "../../actions";
import ModuleCreateClient from "./ModuleCreateClient";



const cacheGetDataModule = cache(async (module, limit, page, searchParams) => {
  return await getDataModule(module, limit, page, searchParams);
});

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

const createForm = async () => {
  return <ModuleCreateClient />;
};

export default createForm;
