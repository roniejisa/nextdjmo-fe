"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { headers } from "next/headers";

export const getDataModule = async (module) => {
  try {
    const token = await getToken();
    return httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL +
        module,
      {
        isAdmin: 1,
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (e) {
    return [];
  }
};



export const getProfile = async () => {
  const header = await headers()
  const user = header.get('user')
  if (user && user != "undefined") {
    return JSON.parse(decodeURIComponent(user))
  }
  return null
}