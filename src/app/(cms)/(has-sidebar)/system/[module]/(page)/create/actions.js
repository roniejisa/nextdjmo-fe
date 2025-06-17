"use server"

import { httpClient } from "@/utils/http"
import { getToken } from "@/utils/server/utils"

export const handleCreate = async (module, formData, language) => {
    const token = await getToken();
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}`+ (language ? `?language=${language}` : ''), {
        isAdmin: 1,
        Authorization: `Bearer ${token}`,
    }, formData, "POST")
    return response
}


export const getDataLanguage = async (module, language, _id = null) => {
    const token = await getToken();
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}/get-data-language`, {
        isAdmin: 1,
        Authorization: `Bearer ${token}`,
    }, {
        module,
        language,
        _id
    })
    return response
}


export const moduleDetail = async (module, language) => {
  const token = await getToken()
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