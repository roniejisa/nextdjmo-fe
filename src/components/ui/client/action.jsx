"use server";
import { httpClient } from "@/utils/http";
import { cookies } from "next/headers";

export const getSearchData = async (body) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "search",
    {},
    body,
    "POST"
  );
  return response;
};

export const sentFormReceive = async (body) => {
  const ssId = (await cookies()).get("ssId")?.value;
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "sent-form-receive",
    {
      ssId,
    },
    body,
    "POST"
  );
  return response;
};

export const getssId = async () => {
  const ssId = cookies().get("ssId")?.value;
  return ssId;
};
