import React from "react";
import FormCreate from "./Form";
import { httpClient } from "@/utils/http";
import { cookies } from "next/headers";

const moduleDetail = async (module, id) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}/create`, {
    isAdmin: 1,
    Authorization: `Bearer ${token}`,
  });
};

export async function generateMetadata({ params }) {
  return {
    title: "...",
  };
}
const createForm = async ({ params }) => {
  const { id, module } = await params;
  let {
    data: { fields, module: moduleStore },
  } = await moduleDetail(module, id);

  fields = fields.filter((field) => {
    field.hiddenForm = field.hiddenForm ?? 0;
    return field.hiddenForm === 0;
  });
  return <FormCreate module={module} fields={fields} moduleStore={moduleStore} />;
};

export default createForm;
