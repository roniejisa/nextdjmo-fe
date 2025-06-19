"use client";

import { useParams, useSearchParams } from "next/navigation";
import FormUpdate from "./FormUpdate";
import { moduleDetail } from "./actions";
import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import useRouterCustom from "@/packages/translation/Navigation";
import { ModuleLoadingDetail } from "../../components/Loading";
import { ModuleError } from "../../components/Error";

const useModuleItemData = (module, id, searchParams) => {
  const { limit = 20, page = 1, ...propSearchParams } = searchParams;

  // Create a stable key for SWR
  const swrKey = useMemo(() => {
    if (!module) return null;
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      ...propSearchParams,
    });
    return `module-${module}-${id}-${params.toString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propSearchParams]);

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => moduleDetail(module, id, propSearchParams.language ?? null),
    {}
  );

  return {
    moduleData: data?.data || {},
    isLoading,
    error,
    mutate,
    limit,
    page,
    propSearchParams,
  };
};

const ModuleItemClient = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouterCustom();
  const { id, module } = params;
  const hasRedirected = useRef(false);

  const searchParamsObject = useMemo(() => {
    const obj = {};
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        obj[key] = value;
      }
    }
    return obj;
  }, [searchParams]);

  const {
    moduleData: data,
    isLoading,
    error,
    mutate,
    limit,
    page,
    propSearchParams,
  } = useModuleItemData(module, id, searchParamsObject);

  // DI CHUYỂN useEffect LÊN TRƯỚC CÁC EARLY RETURN
  useEffect(() => {
    // Chỉ chạy khi data đã load và không bị lỗi
    if (isLoading || error || hasRedirected.current || !data) return;

    const { module: moduleStore } = data;
    const language = searchParamsObject.language ?? null;
    const isMultiple = moduleStore?.language ?? false;

    if (
      isMultiple &&
      Array.isArray(moduleStore?.langs) &&
      (!language || !moduleStore.langs.find((item) => item?.code === language))
    ) {
      hasRedirected.current = true;
      router.push(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          `${module}/${id}?language=${moduleStore.default_lang}`
      );
    }
  }, [isLoading, error, data, searchParamsObject.language, module, id, router]);

  // CÁC EARLY RETURN SAU useEffect
  if (isLoading) {
    return <ModuleLoadingDetail />;
  }

  if (error) {
    return <ModuleError error={error} onRetry={() => mutate()} />;
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
      searchParams={searchParams}
    />
  );
};

export default ModuleItemClient;
