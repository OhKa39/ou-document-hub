'use server'

import { setAuthCookies } from "./setAuthCookies"

export async function verifyRegisterToken(verifyToken: any){
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-register-token?registerToken=${verifyToken}`)
    const dataRes = await data.json()
    if(data.ok){
        setAuthCookies(dataRes.data)
    }
    return dataRes
}