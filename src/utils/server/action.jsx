"use server";

import { cookies } from "next/headers";

export const setDataToken = async (tokenData) => {
  const cookiesData = cookies();
  cookiesData.set("token", tokenData.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  if (tokenData.refreshToken) {
    cookiesData.set("refreshToken", tokenData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }
  return true;
};
