"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import useSWR from "swr";

// Hook tổng quát cho SWR với module
export const useSWRCustom = (
  keyPrefix,
  fetcher,
  searchParams,
  options = {}
) => {
  const {
    defaultValues = { limit: 20, page: 1 },
    dependencies = [],
    dataKey = "data",
    enabled = true,
    swrOptions = {},
  } = options;

  // Merge default values với search params
  const finalParams = useMemo(() => {
    const merged = { ...defaultValues, ...(searchParams || {}) };
    const { limit, page, ...propSearchParams } = merged;

    return {
      limit: Number(limit),
      page: Number(page),
      propSearchParams,
    };
  }, [defaultValues, searchParams]);

  // Tạo stable key cho SWR - luôn tạo key, không return null sớm
  const swrKey = useMemo(() => {
    if (!keyPrefix || !enabled) return null;

    const params = new URLSearchParams({
      limit: finalParams.limit.toString(),
      page: finalParams.page.toString(),
      ...finalParams.propSearchParams,
    });

    return `${keyPrefix}-${params.toString()}`;
  }, [
    keyPrefix,
    enabled,
    finalParams.limit,
    finalParams.page,
    JSON.stringify(finalParams.propSearchParams),
    ...dependencies,
  ]);

  // Tạo fetcher wrapper để handle khi không có key
  const safeFetcher = useMemo(() => {
    if (!swrKey || !fetcher) return null;
    return () => fetcher(finalParams);
  }, [swrKey, fetcher, finalParams]);

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    safeFetcher,
    swrOptions
  );

  return {
    moduleData: data?.[dataKey] || {},
    rawData: data,
    isLoading,
    error,
    mutate,
    limit: finalParams.limit,
    page: finalParams.page,
    propSearchParams: finalParams.propSearchParams,
  };
};

// // Hook cho module item detail
// const useModuleItemData = (module, id, searchParams) => {
//   const keyPrefix = module && id ? `module-${module}-${id}` : null;

//   const fetcher = useCallback((params) => {
//     return moduleDetail(module, id, searchParams?.language ?? null);
//   }, [module, id, searchParams?.language]);

//   return useSWRCustom(keyPrefix, fetcher, searchParams, {
//     dependencies: [id],
//     defaultValues: { limit: 10, page: 1 },
//     enabled: !!(module && id), // Chỉ fetch khi có đủ module và id
//   });
// };

// // Hook cho module data list
// const useModuleData = (module, searchParams) => {
//   const keyPrefix = module ? `module-${module}` : null;

//   const fetcher = useCallback((params) => {
//     return getDataModule(module, params.limit, params.page, params.propSearchParams);
//   }, [module]);

//   return useSWRCustom(keyPrefix, fetcher, searchParams, {
//     defaultValues: { limit: 50, page: 1 },
//     enabled: !!module, // Chỉ fetch khi có module
//   });
// };

// // Ví dụ các use case khác:
// const useUserData = (searchParams) => {
//   const fetcher = useCallback((params) => {
//     return fetchUsers(params.limit, params.page, params.propSearchParams);
//   }, []);

//   return useSWRCustom('users', fetcher, searchParams, {
//     defaultValues: { limit: 25, page: 1, status: 'active' },
//     dataKey: 'users', // Nếu API return { users: [...] }
//     swrOptions: { refreshInterval: 30000 }, // Auto refresh mỗi 30s
//   });
// };

// const useProductData = (categoryId, searchParams) => {
//   const keyPrefix = categoryId ? `products-${categoryId}` : null;

//   const fetcher = useCallback((params) => {
//     return fetchProducts(categoryId, params.limit, params.page, params.propSearchParams);
//   }, [categoryId]);

//   return useSWRCustom(keyPrefix, fetcher, searchParams, {
//     defaultValues: { limit: 12, page: 1, sortBy: 'name' },
//     dependencies: [categoryId],
//     enabled: !!categoryId, // Chỉ fetch khi có categoryId
//     swrOptions: {
//       revalidateOnFocus: false,
//       dedupingInterval: 60000
//     }
//   });
// };
