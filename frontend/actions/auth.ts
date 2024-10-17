'use server';
import { SIGN_IN_ENDPOINT, SIGN_UP_ENDPOINT, VERIFY_REGISTERTOKEN_ENDPOINT } from '@/constants/api_endpoint';
import { SignInSchema } from '@/schemas/SignInSchema';
import { SignUpSchema } from '@/schemas/SignUpSchema';
import { setAuthCookies } from './setAuthCookies';

export async function createAccount(data: any) {
  const parsedData = SignUpSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  console.log(parsedData);

  const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${SIGN_UP_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedData.data),
  })
    .then((data) => data.json())
    .catch((error) => {
      throw new Error(`Fetch error: ${error}`);
    });
  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}

export async function loginAccount(data: any) {
  const parsedData = SignInSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  // console.log(parsedData)

  const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${SIGN_IN_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedData.data),
  })
    .then((data) => data.json())
    .catch((error) => {
      throw new Error(`Fetch error: ${error}`);
    });

  if (dataResponse.statusCode === 200) {
    setAuthCookies(dataResponse.data);
  }

  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}

export async function verifyRegisterToken(verifyToken: any) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${VERIFY_REGISTERTOKEN_ENDPOINT}?registerToken=${verifyToken}`
  );
  const dataRes = await data.json().catch((error) => {
    throw new Error(`Fetch error: ${error}`);
  });
  if (data.ok) {
    setAuthCookies(dataRes.data);
  }
  return dataRes;
}
