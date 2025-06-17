import React from "react";
import FormCreate from "./FormCreate";
import { httpClient } from "@/utils/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDataModule } from "../../actions";

const moduleDetail = async (module, language) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL +
      `${module}/create` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
      Authorization: `Bearer ${token}`,
    }
  );
};

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

const createForm = async ({ params, searchParams }) => {
  const { module } = await params;

  const language = searchParams.language;

  let {
    data: { fields, module: moduleStore },
  } = await moduleDetail(module, language);

  // Kiểm tra có phải 2 ngôn ngữ hay không
  const isMultiple = moduleStore.language ?? false;
  if (
    isMultiple &&
    (!language ||
      moduleStore.langs.find((item) => item.code === language) === undefined)
  ) {
    return redirect(
      process.env.NEXT_PUBLIC_ADMIN_URL +
        `${module}/create?language=${moduleStore.default_lang}`
    );
  }

  // Hết kiểm tra này
  fields = fields.filter((field) => {
    field.hiddenForm = field.hiddenForm ?? 0;
    return field.hiddenForm === 0;
  });

  // Kiểm tra và redirect luôn sang ngôn ngữ mặc định đi

  return (
    <FormCreate
      module={module}
      fields={fields}
      moduleStore={moduleStore}
      searchParams={searchParams}
    />
  );
};

export default createForm;
