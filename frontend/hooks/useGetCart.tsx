import { getCart } from '@/lib/API/cart';
import { useQuery } from '@tanstack/react-query';

const useGetCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    retry: 1,
    // refetchInterval: 1000,
    // enabled: false,
  });
};

export default useGetCart;
