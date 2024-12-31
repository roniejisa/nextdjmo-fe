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