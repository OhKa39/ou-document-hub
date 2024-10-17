'use server';
import { z } from 'zod';
import ShippingAddressSchema from '@/schemas/ShippingAddressSchema';
import ServerFetch from '@/utils/ServerFetch';
import { SHIPPING_ADDRESS_ENDPOINT } from '@/constants/api_endpoint';
import { revalidatePath } from 'next/cache';
export async function createShippingAddress(data: any) {
  const parsedData = ShippingAddressSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  console.log(parsedData);
  console.log(SHIPPING_ADDRESS_ENDPOINT);

  const dataResponse = await ServerFetch(`${SHIPPING_ADDRESS_ENDPOINT}`, {
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

  revalidatePath('/admin/shipping-address-management');
  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}

export async function deleteShippingAddress(id: string) {
  const dataResponse = await ServerFetch(`${SHIPPING_ADDRESS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    throw new Error(`Fetch error: ${error}`);
  });
  revalidatePath('/admin/shipping-address-management');
  return { statusCode: dataResponse.status };
}

export async function updateShippingAddress(id: string, data: any) {
  const parsedData = ShippingAddressSchema.safeParse(data);

  if (!parsedData.success) {
    return { statusCode: 500, error: parsedData.error.errors };
  }

  const dataResponse = await ServerFetch(`${SHIPPING_ADDRESS_ENDPOINT}/${id}`, {
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
  revalidatePath('/admin/shipping-address-management');
  return { statusCode: dataResponse.statusCode, data: dataResponse.data };
}
