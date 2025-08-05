'use server';
import { z } from 'zod';
import EditNameSchema from '@/schemas/EditNameSchema';
import ServerFetch from '@/utils/ServerFetch';
import { SET_AVATAR_ENDPOINT, SET_GENDER_END_POINT, SET_USER_NAME_ENDPOINT } from '@/constants/api_endpoint';
import EditGender from '@/components/(user)/(UserSetting)/MyAccount/BasicInformationComponents/EditGender';
import EditGenderSchema from '@/schemas/EditGenderSchema';
export async function editAvatar(data: FormData) {
  const dataResponse = await ServerFetch(SET_AVATAR_ENDPOINT, {
    method: 'PATCH',
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
    body: data,
  })
    .then((data) => data.json())
    .catch((error) => {
      throw new Error(`Fetch error: ${error}`);
    });

  return { statusCode: dataResponse.statusCode, data: dataResponse.data, message: dataResponse.message };
}

export async function editUserName(data: any) {
  const parsedData = EditNameSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  console.log(parsedData);

  const dataResponse = await ServerFetch(SET_USER_NAME_ENDPOINT, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedData.data),
  })
    .then((data) => data.json())
    .catch((error) => {
      throw new Error(`Fetch error: ${error}`);
    });

  return { statusCode: dataResponse.statusCode, data: dataResponse.data, message: dataResponse.message };
}

export async function editGender(data: any) {
  const parsedData = EditGenderSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  console.log(parsedData);

  const dataResponse = await ServerFetch(SET_GENDER_END_POINT, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedData.data),
  })
    .then((data) => data.json())
    .catch((error) => {
      throw new Error(`Fetch error: ${error}`);
    });
  return { statusCode: dataResponse.statusCode, data: dataResponse.data, message: dataResponse.message };
}
