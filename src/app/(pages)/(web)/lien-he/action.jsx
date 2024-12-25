"use server"

import { httpClient } from "@/utils/http";
import { cookies } from "next/headers";

export const submitContact = async (form) => {
    const ssId = (await cookies()).get('ssId')?.value
    const body = Object.fromEntries(form);
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "sent-form-contact", {
        ssId
    }, body, "POST")
    return response
}