import { httpClient } from "@/utils/http"

export const getDataPost =async (type) => {
    const token = 'TEST'
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL+type,{
        'Authorization': `Bearer ${token}`,
        'X-API-KEY': 123456
    },{},"GET")
    return response
}