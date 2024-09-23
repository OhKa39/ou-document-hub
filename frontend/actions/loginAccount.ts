'use server';
import { SignInSchema } from '@/schemas/SignInSchema';
import { setAuthCookies } from './setAuthCookies';
export async function loginAccount(data: any) {
  const parsedData = SignInSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  // console.log(parsedData)

  const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedData.data),
  }).then((data) => data.json());

  if (dataResponse.statusCode === 200) {
    setAuthCookies(dataResponse.data);
  }

  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}
