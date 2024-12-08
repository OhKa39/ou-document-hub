import { getCurrentUser } from '@/lib/API/users';
import UserType from '@/types/UserType';
import { useQuery } from '@tanstack/react-query';

type props = {data: UserType, statusCode: number, message: string};
const useGetCurrentUser = ()  => {
  return useQuery<props>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: 1,
    refetchInterval: 1000 * 60 * 10,
  });
};

export default useGetCurrentUser;
