"use server";

import { cookies } from "next/headers";

export const handleSaveToken = async (accessToken, refreshToken) => {
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
