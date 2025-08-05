import { getFaculties } from '@/lib/API/faculties';
import { getShippingAddresses } from '@/lib/API/shipping_addresses';
import { useQuery } from '@tanstack/react-query';

const useGetFaculties = () => {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
    retry: 1,
    // refetchInterval: 1000,
    // enabled: false,
  });
};
export default useGetFaculties;
