"use server";

import { httpClient } from "@/utils/http";

export const getSignedUrl = async () => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL +
      `video/hls/encrypted/create_singed_url/data`
  );
  return response.data;
};
