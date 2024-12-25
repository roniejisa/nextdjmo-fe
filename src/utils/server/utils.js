"use server";

import { cookies } from "next/headers";

export const getToken =async () => {
    const storeCookie = await cookies();
    return storeCookie.get("token")?.value;
};