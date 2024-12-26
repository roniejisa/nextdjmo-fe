import { httpClient } from "@/utils/http";
import { notFound, redirect } from "next/navigation";
import FormUpdate from "./FormUpdate";
import { cookies } from "next/headers";
import { getProfile } from "../../actions";
import { cache } from "react";
const moduleDetail = async (module, id) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  return httpClient(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/${id}`, {
    isAdmin: 1,
    Authorization: `Bearer ${token}`,
  });
};

const cacheModuleDetail = cache(async (module, id) => {
  return moduleDetail(module, id);
});

export async function generateMetadata({ params }) {
  const { id, module } = await params;
  const data = await cacheModuleDetail(module, id);
  if (!Object.keys(data).length) {
    return redirect(403)
  }
  return {
    title: data.data.module.name,
  };
}
const DetailComponent = async ({ params }) => {
  const { id, module } = await params;
  const user = await getProfile();
  let { data } = await moduleDetail(module, id);
  if (
    !Object.keys(data).length ||
    !user.permissions.includes(`${module}.update`)
  ) {
    return redirect("/403");
  }
  let { item, fields, module: moduleStore } = data;
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
    />
  );
};

export default DetailComponent;
