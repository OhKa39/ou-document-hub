'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DocumentItem from '@/components/DocumentItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaChevronDown } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { DOCUMENT_ENDPOINT } from '@/constants/api_endpoint';
import Pagination from '@/components/Pagination';

type SortOption = {
  id: string;
  label: string;
  field: string;
  direction: 'asc' | 'desc';
};

type Document = {
  documentId: string;
  name: string;
  price: number;
  rating: number;
  createdAt: string;
  thumbnailUrl: string;
};

const Container = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions: SortOption[] = [
    { id: 'newest', label: 'Mới nhất', field: 'created_at', direction: 'desc' },
    { id: 'oldest', label: 'Cũ nhất', field: 'created_at', direction: 'asc' },
    { id: 'priceAsc', label: 'Giá thấp đến cao', field: 'price', direction: 'asc' },
    { id: 'priceDesc', label: 'Giá cao đến thấp', field: 'price', direction: 'desc' },
    { id: 'ratingDesc', label: 'Đánh giá cao nhất', field: 'rating', direction: 'desc' },
  ];

  const [selectedSort, setSelectedSort] = useState<string>(searchParams.get('sort') || sortOptions[0].id);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 12;

  const currentSortOption = sortOptions.find((option) => option.id === selectedSort) || sortOptions[0];

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', (currentPage - 1).toString());
      params.set('size', pageSize.toString());
      console.log('Fetching documents with params:', params.toString()); // Debug
      const response = await fetch(`${DOCUMENT_ENDPOINT}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response:', result); // Debug
      setDocuments(Array.isArray(result.data?.data) ? result.data.data : []);
      setTotalPages(result.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Không thể tải tài liệu. Vui lòng thử lại.');
      setDocuments([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const pageFromParams = parseInt(searchParams.get('page') || '1', 10);
    console.log('useEffect triggered:', { pageFromParams, currentPage }); // Debug
    if (pageFromParams !== currentPage) {
      setCurrentPage(pageFromParams);
    } else {
      fetchDocuments();
    }
  }, [searchParams, currentPage]);

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortId);
    params.set('page', '1');
    router.push(`/documents?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    console.log('handlePageChange:', { newPage: page, currentPage }); // Debug
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/documents?${params.toString()}`);
  };

  return (
    <div className="flex h-fit w-full flex-col gap-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kho tài liệu</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 font-bold">
              <span className="text-xl">Sắp xếp theo: {currentSortOption.label}</span>
              <FaChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[9999] w-56">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => handleSortChange(option.id)}
                className="flex cursor-pointer items-center justify-between"
              >
                {option.label}
                {selectedSort === option.id && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <p>Đang tải tài liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : documents.length === 0 ? (
        <p>Không tìm thấy tài liệu.</p>
      ) : (
        <div className="grid w-full grid-cols-2 gap-14 lg:grid-cols-3 lg:gap-0">
          {documents.map((item) => (
            <DocumentItem key={item.documentId} {...item} resolutionMobile={[281, 152]} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
    </div>
  );
};

export default Container;
