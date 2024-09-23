'use server';
import { cookies } from 'next/headers';

export async function getAuthCookies() {
  const accessToken = cookies().get('accessToken')?.value ?? null;
  const refreshToken = cookies().get('refreshToken')?.value ?? null;
  const JSESSIONID = cookies().get('JSESSIONID')?.value ?? null;

  return { accessToken, refreshToken, JSESSIONID };
}
