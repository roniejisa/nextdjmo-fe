import React from "react";
import FormCreate from "./Form";
import { httpClient } from "@/utils/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const moduleDetail = async (module, language) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}/create` + (language ? `?language=${language}` : ''), {
    isAdmin: 1,
    Authorization: `Bearer ${token}`,
  });
};

export async function generateMetadata({ params }) {
  return {
    title: "...",
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
  )
    return redirect(
      process.env.NEXT_PUBLIC_ADMIN_URL +
        `${module}/create?language=${moduleStore.default_lang}`
    );

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
