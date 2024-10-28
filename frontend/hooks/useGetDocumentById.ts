import { getDocumentById } from '@/lib/API/documents';
import { useQuery } from '@tanstack/react-query';

const useGetDocumentById = (id: string) => {
  return useQuery({
    queryKey: ['cart', id],
    queryFn: () => getDocumentById(id),
    retry: 1,
    // refetchInterval: 1000,
    // enabled: false,
  });
};

export default useGetDocumentById;
