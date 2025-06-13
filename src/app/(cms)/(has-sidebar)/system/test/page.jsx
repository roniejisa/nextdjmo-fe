"use client";
import { httpClientBlob } from "@/utils/client/http";
import React from "react";
import { getDataPost } from "./action";
import { redirect } from "next/navigation";

const page = ({ searchParams }) => {
  const { test } = searchParams;
  if (!test) {
    redirect("/system");
  }
  const checkRefreshTokenOnClient = async () => {
    const token = "3453454353";
    const one = httpClientBlob(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "posts/export?format=excel",
      {
        Authorization: "Bearer " + token,
      },
      {},
      "POST"
    );
    const two = httpClientBlob(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "posts/export?format=excel",
      {
        Authorization: "Bearer " + token,
      },
      {},
      "POST"
    );
    const three = httpClientBlob(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "posts/export?format=excel",
      {
        Authorization: "Bearer " + token,
      },
      {},
      "POST"
    );
    await Promise.all([one, two, three]);
  };

  const checkRefreshTokenOnServer = async () => {
    const three = getDataPost("posts");
    const one = getDataPost("links");
    const two = getDataPost("topics");
    await Promise.all([one, two, three]);
  };
  return (
    <div>
      <button onClick={checkRefreshTokenOnClient}>Refresh Token Client</button>
      <button onClick={checkRefreshTokenOnServer}>Refresh Token Server</button>
    </div>
  );
};

export default page;
