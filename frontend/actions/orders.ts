import { PAYMENT_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';

export const createOrder = async () => {
  const resFetch = await ServerFetch(`${PAYMENT_ENDPOINT}/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // use the "body" param to optionally pass additional order information
    // like product ids and quantities
  });
  const res = await resFetch.json();
  return res.data.id;
};

export const captureOrder = async (data: any) => {
  const response = await ServerFetch(`${PAYMENT_ENDPOINT}/checkout/orders/${data.orderID}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // use the "body" param to optionally pass additional order information
    // like product ids and quantities
  });
  const res = await response.json();
  return res;
};
