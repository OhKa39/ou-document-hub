import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setAuthCookies } from './actions/setAuthCookies';
import { ResponseCookies, RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
import { ClientRequest } from 'http';
// import ServerFetch from './utils/ServerFetch'

function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (key === 'x-middleware-override-headers' || key.startsWith('x-middleware-request-')) {
      res.headers.set(key, value);
    }
  });
}
 
export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if(!accessToken && refreshToken){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/renew-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    }).then(data=>data.json());
    // console.log(response)
    if(response.statusCode === 200){
      res.cookies.set("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 10,
        path: '/'
      });
      res.cookies.set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path:'/'
      });
    }
    else
      request.cookies.clear();
    applySetCookie(request, res);
  }
  return res
}