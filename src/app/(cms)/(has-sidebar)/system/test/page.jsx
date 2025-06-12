"use client";
import { httpClientBlob, httpClient as httpMainClient } from "@/utils/client/http";
import { getToken } from "@/utils/server/utils";
import React from "react";
import { getDataPost } from "./action";

const page = () => {
  const checkRefreshTokenOnClient = async () => {
    const token = "3453454353"
    const one = httpClientBlob(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "posts/export?format=excel",{
        "Authorization":"Bearer " + token
      },{}
    ,"POST");
    const two = httpClientBlob(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "posts/export?format=excel",{
        "Authorization":"Bearer " + token
      },{}
    ,"POST");
    const three = httpClientBlob(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "posts/export?format=excel",{
        "Authorization":"Bearer " + token
      },{}
    ,"POST");
    const data = await Promise.all([one,two,three])
  };

  const checkRefreshTokenOnServer = async () => {
    const three = getDataPost("posts");
    const one = getDataPost("links");
    const two = getDataPost("topics");
    const data = await Promise.all([one,two,three])
  };
  return (
    <div>
      <button onClick={checkRefreshTokenOnClient}>Refresh Token Client</button>
      <button onClick={checkRefreshTokenOnServer}>Refresh Token Client</button>
    </div>
  );
};

export default page;
