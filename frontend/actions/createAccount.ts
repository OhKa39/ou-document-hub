'use server'
import {z} from 'zod'
import {SignUpSchema} from '@/schemas/SignUpSchema'
export async function createAccount(data: any) {
  const parsedData = SignUpSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  console.log(parsedData)

  const dataResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedData.data),
  }).then((data)=> data.json())

  return { statusCode: dataResponse.statusCode, data: dataResponse.data};
}