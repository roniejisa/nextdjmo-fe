"use server"

import { httpClient } from "@/utils/http";
import { cookies, headers } from "next/headers";
var jwt = require('jsonwebtoken');
export const handleLogin = async (payload) => {
    const headersList = await headers();
    const objectHeader = Object.fromEntries(headersList);
    try {
        const obj = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/login", {
            'User-Agent': objectHeader['user-agent'],
            'X-API-KEY': "123456"
        }, payload, "POST");

        setCookieAuth(obj)


        return {
            data: obj.data,
            status: obj.status,
            message: obj.message,
        };
    } catch (err) {
        return {
            status: 500,
            message: err.message,
        }
    }
}

export const confirm2FA = async (payload) => {
    const headersList = await headers();
    const objectHeader = Object.fromEntries(headersList);
    // try {
    const obj = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/confirm-2fa", {
        'User-Agent': objectHeader['user-agent'],
        'X-API-KEY': "123456"
    }, payload, "POST");
    setCookieAuth(obj)
    return {
        status: obj.status,
        message: obj.message,
    };
    // } catch (err) {
    //     return {
    //         status: 500,
    //         message: err.message,
    //     }
    // }
}


const setCookieAuth = (obj) => {
    try {

        const { accessToken, refreshToken } = obj.data;
        if (accessToken && refreshToken) {
            // Dữ liệu fake để sau khi hoàn thành authenticate
            // cookies().set({ name: "token", value: jwt.sign({ name: undefined }, 'hehehe'), httpOnly: true, secure: true });
            // cookies().set({ name: "refreshToken", value: jwt.sign({ name: undefined }, 'hehehe'), httpOnly: true, secure: true });

            // Dữ liệu real
            cookies().set({ name: "token", value: accessToken, httpOnly: true, secure: true, path: "/", sameSite: "strict" });
            cookies().set({ name: "refreshToken", value: refreshToken, httpOnly: true, secure: true, path: "/", sameSite: "strict" });
        }
    } catch (e) {

    }
}