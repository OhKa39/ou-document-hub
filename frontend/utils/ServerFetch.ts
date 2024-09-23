import { getAuthCookies } from '@/actions/getAuthCookies';

const BASE_URL = process.env.NEXT_PUBLIC_HOST;

export default async function ServerFetch(url: any, options: RequestInit = {}) {
  let { accessToken, JSESSIONID } = await getAuthCookies();

  const fetchOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      Cookie: `JSESSIONID=${JSESSIONID}`,
    },
  };

  // console.log(fetchOptions)

  let response = await fetch(`${BASE_URL}${url}`, fetchOptions);

  // console.log(response)

  return response;
}
