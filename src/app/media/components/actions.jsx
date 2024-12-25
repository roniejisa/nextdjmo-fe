"use server";

import { getToken } from "@/utils/server/utils";

export const handleUpdateImage = async (formData) => {
  const token = await getToken();
  const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL + "media/edit-file", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
    method: "PATCH",
  });

  const data = await response.json();
  
  return data;
};

export const checkHistoryFile = async (id) => {
  const token = await getToken();
  const response = await fetch(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "media/history-file/" + id,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};
