"use server"

import { cookies } from "next/headers";


export const getToken = async () => {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;
    return token;
};