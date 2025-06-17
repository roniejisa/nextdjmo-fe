"use server";
import { httpClient } from "@/utils/http";

export const getDataModule = async (module) => {
    return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + module, {
      isAdmin: 1,
    });
  
};
