"use client";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import FormCreate from "./FormCreate";
import useSWR from "swr";
import { moduleCreate } from "./actions";
import { ModuleLoadingDetail } from "../../components/Loading";
import { ModuleError } from "../../components/Error";

const ModuleCreateClient = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const { module } = params;
  const urlParams = new URLSearchParams(searchParams);
  const keyModuleParams = `module-${pathname}-${params.module}-${urlParams.toString()}`;
  const language = searchParams.language;
  const { data, error, isLoading, mutate } = useSWR(
    keyModuleParams,
    () => moduleCreate(module, language),
    {
      dedupingInterval: 0,
    }
  );

  if (isLoading) {
    return <ModuleLoadingDetail />;
  }
  if (error) {
    return <ModuleError />;
  }
  let { fields, module: moduleStore } = data.data;

  // Kiểm tra có phải 2 ngôn ngữ hay không
  const isMultiple = moduleStore?.language ?? false;
  if (
    isMultiple &&
    (!language ||
      moduleStore.langs.find((item) => item.code === language) === undefined)
  ) {
    router.push(
      process.env.NEXT_PUBLIC_ADMIN_URL +
        `${module}/create?language=${moduleStore.default_lang}`
    );
  }
  // Hết kiểm tra này
  fields = fields?.filter((field) => {
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

export default ModuleCreateClient;
