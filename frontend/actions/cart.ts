import { CART_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';
import { revalidatePath } from 'next/cache';

export async function postItemToCart(data: FormData) {
  console.log(data);
  const dataResponse = await ServerFetch(`${CART_ENDPOINT}`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    body: data,
  }).catch((error) => {
    throw new Error(`Fetch error: ${error}`);
  });

  if (dataResponse.ok) {
    const response = await dataResponse.json();
    return { statusCode: response.statusCode, data: response.data };
  }

  return { statusCode: dataResponse.status };
}
