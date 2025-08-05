import { getUserById } from '@/lib/API/users';
import UserType from '@/types/UserType';
import { useQuery } from '@tanstack/react-query';

type props = { data: UserType; statusCode: number; message: string };
const useGetUserById = (targetUserId: string) => {
  return useQuery<props>({
    queryKey: ['user', targetUserId],
    queryFn: () => getUserById(targetUserId),
  });
};
export default useGetUserById;
