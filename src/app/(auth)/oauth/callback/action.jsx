"use server";

import { httpClient } from "@/utils/http";
import { cookies } from "next/headers";

export const handleSaveToken = async (accessToken, refreshToken) => {
  // Nên có 1 bước kiểm tra auth ở đây nhỉ
  const profile = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/profile",
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );

  if (profile.status !== 200) return false;

  cookies().set({
    name: "token",
    value: accessToken,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  });

  cookies().set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  });

  return true;
};
