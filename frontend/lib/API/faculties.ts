import { FACULTY_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';

export const getFaculties = async () => {
  const data = await ServerFetch(`${FACULTY_ENDPOINT}?page=${0}&size=${100000}`);
  const res = await data.json();
  return res;
};
