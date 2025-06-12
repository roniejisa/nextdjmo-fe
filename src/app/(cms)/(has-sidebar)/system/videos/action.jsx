"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { revalidatePath } from "next/cache";
export const convertVideoToTs = async (id) => {
  const token = getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `videos/convert-video-to-ts/${id}`,
    {
      Authozization: "Bearer " + token,
    }
  );
  return response;
};

export const refreshPath = async (url) => {
  revalidatePath(url);
};
