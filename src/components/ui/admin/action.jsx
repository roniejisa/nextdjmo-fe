"use server";
import { cookies } from "next/headers";

export const handleLogout = async () => {
  cookies().delete("token");
  cookies().delete("refreshToken");
  return true;
};