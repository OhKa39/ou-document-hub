'use server';
import { z } from 'zod';
import EditNameSchema from '@/schemas/EditNameSchema';
import ServerFetch from '@/utils/ServerFetch';
export async function editUserName(data: any) {
  const parsedData = EditNameSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  console.log(parsedData);

  const dataResponse = await ServerFetch(`/api/v1/user/edit-name`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedData.data),
  }).then((data) => data.json());

  return { statusCode: dataResponse.statusCode, data: dataResponse.data, message: dataResponse.message };
}
