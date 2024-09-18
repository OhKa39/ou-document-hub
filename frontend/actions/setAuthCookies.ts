'use server'
import { cookies } from "next/headers"

export async function setAuthCookies(data: any) {
    cookies().set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 10,
        path: '/'
      });
    cookies().set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
}