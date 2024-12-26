"use server"

import { cookies } from "next/headers"

export const handleUpdate = async (module, formData) => {
    const storeCookie = await cookies()
    const token = storeCookie.get("token")?.value
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}`, {
        headers: {
            isAdmin: 1,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-API-KEY': '123456'
        },
        method:"POST",
        body: JSON.stringify(formData)
    })
    const data = await response.json()
    return data
}