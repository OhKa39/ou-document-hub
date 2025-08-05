'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProductCarouselProps = {
  images: string[];
  labels?: {
    isNew?: boolean;
    discount?: number;
  };
  className?: string;
};

const ProductCarousel = ({ images, labels, className }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Labels */}
      {labels && (
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          {labels.isNew && <div className="bg-black px-3 py-1 text-xs font-semibold text-white">NEW</div>}
          {labels.discount && (
            <div className="bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">-{labels.discount}%</div>
          )}
        </div>
      )}

      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F3F5F7]">
        <Image
          src={images[currentIndex] || '/placeholder.svg'}
          alt={`Product image ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'relative h-20 w-20 overflow-hidden border-2',
              currentIndex === index ? 'border-black' : 'border-transparent'
            )}
          >
            <Image src={image || '/placeholder.svg'} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
