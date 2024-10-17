import { SHIPPING_ADDRESS_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';

export const getShippingAddresses = async () => {
  const data = await ServerFetch(`${SHIPPING_ADDRESS_ENDPOINT}?page=${0}&size=${1000000}`);
  const res = await data.json();
  return res;
};
