"use server";
import { cookies } from "next/headers";


export const getToken = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  return token
}

export const getRefreshToken = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("refreshToken")?.value;
  return token
}