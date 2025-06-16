"use server";
import { cookies, headers } from "next/headers";
import { httpClient } from "../http";

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
  const token = await getToken();
  if(!token){
    return {
      status:false,
      data:{},
      message:"Chưa đăng nhập"
    }
  }
  const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
