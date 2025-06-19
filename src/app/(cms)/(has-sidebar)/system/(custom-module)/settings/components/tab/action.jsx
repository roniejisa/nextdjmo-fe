"use server";

import { httpClient } from "@/utils/http";

export const formSubmitSetting = async (form) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}settings/save-all`,
    {},
    form,
    "POST"
  );
};
