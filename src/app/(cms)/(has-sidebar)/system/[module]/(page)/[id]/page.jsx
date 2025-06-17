export const dynamic = "force-dynamic";
export const revalidate = 0;
import { redirect } from "next/navigation";
import { cache } from "react";
import ModuleItemClient from "./ModuleItemClient";
import { moduleDetail } from "./actions";

const cacheModuleDetail = cache(async (module, id, language) => {
  return moduleDetail(module, id, language);
});

export async function generateMetadata({ params, searchParams }) {
  const { id, module } = await params;
  const data = await cacheModuleDetail(module, id, searchParams.language);
  if (!Object.keys(data).length) {
    return redirect(403);
  }
  return {
    title: data.data.module.name,
  };
}
const DetailComponent = async () => {
  return <ModuleItemClient />;
};

export default DetailComponent;
