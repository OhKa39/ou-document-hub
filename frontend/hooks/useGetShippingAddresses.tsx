import { getShippingAddresses } from '@/lib/API/shipping_addresses';
import { useQuery } from '@tanstack/react-query';

const useGetShippingAddresses = () => {
  return useQuery({
    queryKey: ['shipping_addresses'],
    queryFn: getShippingAddresses,
    retry: 1,
    // refetchInterval: 1000,
    // enabled: false,
  });
};
export default useGetShippingAddresses;
