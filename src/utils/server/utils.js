"use server";
import { cookies, headers } from "next/headers";

export const getToken = async () => {
  const storeCookie = cookies();
  const token = storeCookie.get("token")?.value;
  return token;
};

export const getRefreshToken = async () => {
  const storeCookie = cookies();
  const token = storeCookie.get("refreshToken")?.value;
  return token;
};

export const getProfile = async () => {
  const header = headers();
  const user = header.get("user");
  if (user && user != "undefined") {
    return JSON.parse(decodeURIComponent(user));
  }
  return {}
};
