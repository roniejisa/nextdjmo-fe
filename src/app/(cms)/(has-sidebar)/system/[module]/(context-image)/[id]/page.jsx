export const dynamic = "force-dynamic";
export const revalidate = 0;
import { httpClient } from "@/utils/http";
import { notFound, redirect } from "next/navigation";
import FormUpdate from "./FormUpdate";
import { cookies } from "next/headers";
import { cache } from "react";
const moduleDetail = async (module, id, language) => {
  const storeCookie = cookies();
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

  const language = searchParams.language;

  let { status, data } = await moduleDetail(module, id, language);
  if (status !== 200) {
    return notFound();
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
