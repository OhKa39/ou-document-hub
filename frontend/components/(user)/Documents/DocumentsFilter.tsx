// frontend/components/DocumentsFilter.tsx
'use client';
import { useState, useEffect } from 'react';
import filter from '@/public/Filter.svg';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import useGetShippingAddresses from '@/hooks/useGetShippingAddresses';
import toTitleCase from '@/utils/ToTitleCase';
import useGetFaculties from '@/hooks/useGetFaculties';

const DocumentsFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL query parameters
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>(searchParams.get('addresses')?.split(',') || []);
  const [priceRange, setPriceRange] = useState<number[]>([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '1000000'),
  ]);
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '0');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '1000000');
  const [selectedFaculty, setSelectedFaculty] = useState<string>(searchParams.get('faculty') || '');
  const [documentType, setDocumentType] = useState<string>(searchParams.get('documentType') || '');
  const [selectedRating, setSelectedRating] = useState<string>(searchParams.get('rating') || '');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleAddress = (addressName: string) => {
    setSelectedAddresses((prev) =>
      prev.includes(addressName) ? prev.filter((name) => name !== addressName) : [...prev, addressName]
    );
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    setMinPrice(values[0].toString());
    setMaxPrice(values[1].toString());
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    const numValue = Number.parseInt(value) || 0;
    setPriceRange([numValue, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    const numValue = Number.parseInt(value) || 1000000;
    setPriceRange([priceRange[0], numValue]);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (selectedAddresses.length > 0) params.set('addresses', selectedAddresses.join(','));
    if (priceRange[0] !== 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] !== 1000000) params.set('maxPrice', priceRange[1].toString());
    if (selectedFaculty) params.set('faculty', selectedFaculty);
    if (documentType) params.set('documentType', documentType);
    if (selectedRating) params.set('rating', selectedRating);
    // Preserve sort parameter if it exists
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);

    router.push(`/documents?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedAddresses([]);
    setPriceRange([0, 1000000]);
    setMinPrice('0');
    setMaxPrice('1000000');
    setSelectedFaculty('');
    setDocumentType('');
    setSelectedRating('');
    // Preserve sort parameter
    const sort = searchParams.get('sort');
    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    router.push(`/documents?${params.toString()}`);
  };

  const renderStars = (rating: number, isSelected: boolean) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? isSelected
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-300 text-gray-300'
                : 'text-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating} sao trở lên</span>
      </div>
    );
  };

  const { data, isLoading: shippingAddressesLoading, isError } = useGetShippingAddresses();
  const { data: faculties, isLoading: facultiesLoading } = useGetFaculties();

  const starRatings = [5, 4, 3, 2, 1];

  return (
    <div className="flex h-fit min-w-[262px] flex-col gap-6 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image alt="filter" src={filter || '/placeholder.svg'} className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Bộ lọc</h1>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase">Đánh giá</h2>
            <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
              <div className="space-y-3">
                {starRatings.map((rating) => (
                  <div className="flex items-center space-x-2" key={rating}>
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                      {renderStars(rating, selectedRating === rating.toString())}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase">Khoảng giá</h2>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={1000000}
                min={0}
                step={10000}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-price" className="text-sm text-gray-600">
                    Từ
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <span className="mt-6 text-gray-400">-</span>
                <div className="flex-1">
                  <Label htmlFor="max-price" className="text-sm text-gray-600">
                    Đến
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    placeholder="1000000"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {priceRange[0].toLocaleString('vi-VN')} đ - {priceRange[1].toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase">Khoa</h2>
            {facultiesLoading ? (
              <p>Loading faculties...</p>
            ) : (
              <RadioGroup value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <div className="space-y-2">
                  {faculties?.data.content.map((faculty: any) => (
                    <div className="flex items-center space-x-2" key={faculty.id}>
                      <RadioGroupItem value={faculty.facultyID} id={faculty.facultyID} />
                      <Label htmlFor={faculty.facultyID} className="font-semibold text-[#807E7E]">
                        {faculty.facultyName}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase">Loại tài liệu</h2>
            <RadioGroup value={documentType} onValueChange={setDocumentType}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Online" id="online" />
                  <Label htmlFor="online" className="font-semibold text-[#807E7E]">
                    Tài liệu điện tử
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Paper" id="paper" />
                  <Label htmlFor="paper" className="font-semibold text-[#807E7E]">
                    Tài liệu giấy
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase">Cơ sở</h2>
            <div className="custom-scrollbar min-h-[70px] space-y-2 overflow-y-hidden">
              {shippingAddressesLoading ? (
                <p>Loading filter shipping addresses...</p>
              ) : (
                <div className="space-y-2 font-semibold text-[#807E7E]">
                  {data?.data?.content.map((category: any) => (
                    <div className="flex items-center space-x-2" key={category.addressId}>
                      <Checkbox
                        id={category.addressId}
                        checked={selectedAddresses.includes(category.addressName)}
                        onCheckedChange={() => toggleAddress(category.addressName)}
                      />
                      <Label htmlFor={category.addressId}>{toTitleCase(category.addressName)}</Label>
                    </div>
                  ))}
                </div>
              )}
              {isError && <p>Error loading addresses</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-4">
            <Button onClick={handleApplyFilters} className="w-full">
              Áp dụng bộ lọc
            </Button>
            <Button onClick={handleClearFilters} variant="outline" className="w-full">
              Xóa tất cả bộ lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsFilter;
