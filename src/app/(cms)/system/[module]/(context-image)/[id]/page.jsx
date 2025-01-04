import { httpClient } from "@/utils/http";
import { notFound, redirect } from "next/navigation";
import FormUpdate from "./FormUpdate";
import { cookies } from "next/headers";
import { getProfile } from "../../actions";
import { cache } from "react";
export const dynamic = "force-dynamic";
const moduleDetail = async (module, id, language) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/${id}` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
      Authorization: `Bearer ${token}`,
    }
  );
};

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
const DetailComponent = async ({ params, searchParams }) => {
  const { id, module } = await params;
  const user = await getProfile();

  const language = searchParams.language;

  let { data } = await moduleDetail(module, id, language);



  if (
    !Object.keys(data).length ||
    !user.permissions.includes(`${module}.update`)
  ) {
    return redirect("/403");
  }
  let { item, fields, module: moduleStore } = data;
  // Kiểm tra có phải 2 ngôn ngữ hay không
  const isMultiple = moduleStore.language ?? false;
  if (
    isMultiple &&
    (!language ||
      moduleStore.langs.find((item) => item.code === language) === undefined)
  ) {
    return redirect(
      process.env.NEXT_PUBLIC_ADMIN_URL +
        `${module}/${id}?language=${moduleStore.default_lang}`
    );
  }


  fields = fields.filter((field) => {
    field.hiddenForm = field.hiddenForm ?? 0;
    return field.hiddenForm === 0;
  });

  return (
    <FormUpdate
      item={item}
      module={module}
      id={id}
      fields={fields}
      moduleStore={moduleStore}
      searchParams={searchParams}
    />
  );
};

export default DetailComponent;
