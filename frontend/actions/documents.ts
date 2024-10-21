'use server';

import { DOCUMENT_ENDPOINT } from '@/constants/api_endpoint';
import DocumentSchema from '@/schemas/DocumentSchema';
import ServerFetch from '@/utils/ServerFetch';
import { revalidatePath } from 'next/cache';

export async function createDocument(data: FormData) {
  // const parsedData = DocumentSchema.safeParse(data);

  // if (!parsedData.success) {
  //   return { statusCode: 500, error: parsedData.error.errors };
  // }

  // console.log(parsedData);
  console.log(data);
  const dataResponse = await ServerFetch(`${DOCUMENT_ENDPOINT}`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    body: data,
  })
    .then((data) => data.json())
    .catch((error) => {
      throw new Error(`Fetch error: ${error}`);
    });

  revalidatePath('/seller-channel/documents');
  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}

export async function reviewDocument(documentID: string, status: string) {
  const dataResponse = await ServerFetch(`${DOCUMENT_ENDPOINT}/admin/${documentID}?status=${status}`, {
    method: 'PATCH',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).catch((error) => {
    throw new Error(`Fetch error: ${error}`);
  });

  revalidatePath('/admin/document-review');
  return dataResponse;
}
