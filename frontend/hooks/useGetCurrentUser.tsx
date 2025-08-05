import { getCurrentUser } from '@/lib/API/users';
import ResponseType from '@/types/ResponseType';
import UserType from '@/types/UserType';
import { useQuery } from '@tanstack/react-query';

type props = { data: UserType; statusCode: number; message: string };
const useGetCurrentUser = () => {
  return useQuery<props, ResponseType>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export default useGetCurrentUser;
