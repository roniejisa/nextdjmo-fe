"use server"

import { httpClient } from "@/utils/http"
import { getToken } from "@/utils/server/utils"

export const formSubmitSetting = async (form) => {
    const token = await getToken()
    return httpClient(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}settings/save-all`, {
        Authorization: `Bearer ${token}`
    }, form,'POST')
} 