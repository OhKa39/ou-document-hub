'use server';
import { z } from 'zod';
import FacultySchema from '@/schemas/FacultySchema';
import ServerFetch from '@/utils/ServerFetch';
import { FACULTY_ENDPOINT } from '@/constants/api_endpoint';
import { revalidatePath } from 'next/cache';
export async function createFaculty(data: any) {
  const parsedData = FacultySchema.safeParse(JSON.parse(JSON.stringify(data)));

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  console.log(parsedData);

  const dataResponse = await ServerFetch(`${FACULTY_ENDPOINT}`, {
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

  revalidatePath('/admin/faculty-management');
  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}

export async function deleteFaculty(id: string) {
  const dataResponse = await ServerFetch(`${FACULTY_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    throw new Error(`Fetch error: ${error}`);
  });
  revalidatePath('/admin/faculty-management');
  return { statusCode: dataResponse.status };
}

export async function updateFaculty(id: string, data: any) {
  const parsedData = FacultySchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  const dataResponse = await ServerFetch(`${FACULTY_ENDPOINT}/${id}`, {
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
  revalidatePath('/admin/faculty-management');
  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}
