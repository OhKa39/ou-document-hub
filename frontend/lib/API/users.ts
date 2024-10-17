import { GET_USER_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';

export const getCurrentUser = async () => {
  const userResponse = await ServerFetch(GET_USER_ENDPOINT);
  // console.log(userResponse);
  if (!userResponse.ok) {
    throw new Error('Network response was not ok');
  }
  return userResponse.json();
};
