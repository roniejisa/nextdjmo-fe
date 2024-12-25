"use server"
import { httpClient } from "@/utils/http"
import { cookies } from "next/headers"

export const handleUpdate = async (module, id, formData) => {
    const storeCookie = await cookies()
    const token = storeCookie.get("token")?.value
    const data = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}/${id}`, {
        isAdmin: 1,
        Authorization: `Bearer ${token}`,
    }, formData,'PATCH')
    return data
}