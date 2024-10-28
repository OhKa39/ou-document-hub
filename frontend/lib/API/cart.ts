import { CART_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';

export const getCart = async () => {
  const response = await ServerFetch(CART_ENDPOINT);
  // console.log(response);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
