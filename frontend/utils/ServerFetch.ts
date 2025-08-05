import { getAuthCookies } from '@/actions/getAuthCookies';

const BASE_URL = process.env.NEXT_PUBLIC_HOST;

export default async function ServerFetch(url: any, options: RequestInit = {}, onAuthError?: (data: boolean) => void) {
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
  if (response.status === 401 || response.status === 403) {
    if (onAuthError) onAuthError(true); // show modal
    throw new Error('Unauthenticated'); // react-query will handle this
  }

  // console.log(response)

  return response;
}
