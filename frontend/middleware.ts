import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setAuthCookies } from './actions/setAuthCookies';
import { ResponseCookies, RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
import { ClientRequest } from 'http';
import { GET_USER_ENDPOINT, RENEW_SESSION_ENDPOINT } from './constants/api_endpoint';
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
  const res = NextResponse.next();
  let accessToken = request.cookies.get('accessToken')?.value;
  let refreshToken = request.cookies.get('refreshToken')?.value;
  const JSESSIONID = request.cookies.get('JSESSIONID')?.value;

  if (!accessToken && refreshToken) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${RENEW_SESSION_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).then((data) => data.json());
    // console.log(response)
    if (response.statusCode === 200) {
      accessToken = response.data.accessToken;
      refreshToken = response.data.refreshToken;
      res.cookies.set('accessToken', accessToken!, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 10,
        path: '/',
      });
      res.cookies.set('refreshToken', refreshToken!, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    } else request.cookies.clear();
    applySetCookie(request, res);
  }

  if (
    request.nextUrl.pathname.startsWith('/oauth2') ||
    request.nextUrl.pathname.startsWith('/sign-up') ||
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/verify-token')
  ) {
    const dataUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${GET_USER_ENDPOINT}`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        Cookie: `JSESSIONID=${JSESSIONID}`,
      },
    });
    // console.log(dataUser);
    if (dataUser.ok) return NextResponse.redirect(new URL('/', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const dataUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${GET_USER_ENDPOINT}`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        Cookie: `JSESSIONID=${JSESSIONID}`,
      },
    });
    // console.log(dataUser);
    if (dataUser.ok) {
      const dataRes = await dataUser.json();
      if (dataRes.data['roles'].includes('ROLE_ADMIN')) return res;
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return res;
}
