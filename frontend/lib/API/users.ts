import { GET_USER_ENDPOINT, USER_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';

export const getCurrentUser = async () => {
  const userResponse = await ServerFetch(GET_USER_ENDPOINT);
  // console.log(userResponse);
  return userResponse.json();
};

export const getUserById = async (id: string) => {
  const userResponse = await ServerFetch(USER_ENDPOINT + `/${id}`);

  if (!userResponse.ok) {
    const errorData = await userResponse.json().catch(() => ({})); // fallback if no json
    const message = errorData?.message || `Error: ${userResponse.status}`;
    throw new Error(message);
  }
  return userResponse.json();
};
