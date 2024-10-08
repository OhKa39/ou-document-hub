'use server';
import { z } from 'zod';
import EditNameSchema from '@/schemas/EditNameSchema';
import ServerFetch from '@/utils/ServerFetch';
export async function editAvatar(data: FormData) {
  const dataResponse = await ServerFetch(`/api/v1/user/edit-avatar`, {
    method: 'PATCH',
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
    body: data,
  }).then((data) => data.json());

  return { statusCode: dataResponse.statusCode, data: dataResponse.data, message: dataResponse.message };
}
