'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  maxPagesToShow?: number;
};

const Pagination = ({ currentPage, totalPages, handlePageChange, maxPagesToShow = 5 }: PaginationProps) => {
  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <nav className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row" aria-label="Pagination">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
          className="h-8 w-8 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(1)}
              className="h-8 w-8 rounded-md p-0 transition-all"
              aria-current={currentPage === 1 ? 'page' : undefined}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-1 text-muted-foreground">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(page)}
            className={cn('h-8 w-8 rounded-md p-0 transition-all', currentPage === page && 'font-medium')}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-muted-foreground">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              className="h-8 w-8 rounded-md p-0 transition-all"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Trang sau"
          className="h-8 w-8 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{currentPage}</span>
        <span> / {totalPages}</span>
      </div>
    </nav>
  );
};

export default Pagination;
