"use server"

import { httpClient } from "@/utils/http"
import { cookies } from "next/headers"

export const handleUpdate = async (module, formData) => {
    const storeCookie = await cookies()
    const token = storeCookie.get("token")?.value
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}`, {
        isAdmin: 1,
        Authorization: `Bearer ${token}`,
    }, formData, "POST")
    return response
}