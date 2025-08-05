'use client';

import { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoCloseOutline, IoDocumentTextOutline, IoPersonOutline } from 'react-icons/io5';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { SearchCategory, SearchResult } from '@/types/SearchType';
import { fetchSearchSuggestions } from '@/lib/API/documents';
import debounce from 'debounce';
import Image from 'next/image';

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(query);
    }, 500); // Adjust delay as needed (e.g. 300ms)

    handler(); // call debounced function
    return handler.clear; // clean up on unmount
  }, [query]);

  // Use React Query to fetch search suggestions
  const { data, isLoading, error } = useQuery({
    queryKey: ['searchSuggestions', debouncedQuery, searchCategory],
    queryFn: () => fetchSearchSuggestions(debouncedQuery, searchCategory, 10),
    enabled: open, // Only fetch when the dialog is open
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });

  // Process the API response into the SearchResult format
  const results: SearchResult[] = [];
  if (data) {
    // Add documents
    if (data.Documents && (searchCategory === 'all' || searchCategory === 'documents')) {
      results.push(
        ...data.Documents.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          url: doc.url,
          image: doc.image || '/placeholder.svg?height=40&width=40',
          type: 'document' as const,
        }))
      );
    }
    // Add sellers
    if (data.Sellers && (searchCategory === 'all' || searchCategory === 'sellers')) {
      results.push(
        ...data.Sellers.map((seller: any) => ({
          id: seller.id,
          title: seller.title,
          category: seller.category,
          url: seller.url,
          image: seller.image || '/placeholder.svg?height=40&width=40',
          type: 'seller' as const,
        }))
      );
    }
  }

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSearch = () => {
    setOpen(!open);
    if (!open) {
      setQuery('');
      setSearchCategory('all');
    }
  };

  const handleCategoryChange = (value: string) => {
    setSearchCategory(value as SearchCategory);
  };

  return (
    <>
      <IoSearchOutline
        size="30"
        data-testid="Search"
        className="button-navbar hidden cursor-pointer lg:block"
        onClick={toggleSearch}
      />

      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogContent className="z-[9999] max-w-4xl gap-0 border-none bg-background/95 p-0 backdrop-blur-sm">
          <div className="flex w-full flex-col">
            <div className="flex items-center border-b px-4">
              <IoSearchOutline className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for documents, sellers..."
                  className="h-14 w-full border-none bg-transparent text-lg outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="border-b">
              <Tabs value={searchCategory} onValueChange={handleCategoryChange} className="w-full">
                <TabsList className="h-12 w-full justify-start bg-transparent p-0">
                  <TabsTrigger
                    value="all"
                    className="h-12 rounded-none px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="h-12 rounded-none px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <IoDocumentTextOutline className="mr-2 h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger
                    value="sellers"
                    className="h-12 rounded-none px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <IoPersonOutline className="mr-2 h-4 w-4" />
                    Sellers
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-4 py-6">
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : error ? (
                <div className="py-6 text-center text-sm text-red-500">
                  Error fetching results: {(error as Error).message}
                </div>
              ) : results.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found. Try a different search term.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Documents Group */}
                  {results.some((r) => r.type === 'document') && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Documents</h3>
                      <div className="space-y-1">
                        {results
                          .filter((result) => result.type === 'document')
                          .map((result) => (
                            <div
                              key={result.id}
                              className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-3 hover:bg-muted"
                              onClick={() => {
                                window.location.href = result.url; // Navigate to the document URL
                                setOpen(false);
                              }}
                            >
                              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                                <img
                                  src={result.image || '/placeholder.svg'}
                                  alt={result.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{result.title}</span>
                                <span className="text-xs text-muted-foreground">{result.category}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Sellers Group */}
                  {results.some((r) => r.type === 'seller') && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Sellers</h3>
                      <div className="space-y-1">
                        {results
                          .filter((result) => result.type === 'seller')
                          .map((result) => (
                            <div
                              key={result.id}
                              className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-3 hover:bg-muted"
                              onClick={() => {
                                window.location.href = result.url; // Navigate to the seller URL
                                setOpen(false);
                              }}
                            >
                              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted">
                                <img
                                  src={result.image || '/placeholder.svg'}
                                  alt={result.title}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{result.title}</span>
                                <span className="text-xs text-muted-foreground">{result.category}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t px-4 py-4 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <div>
                  Press <kbd className="rounded border px-1 py-0.5 text-xs">ESC</kbd> to close
                </div>
                <div>
                  <span className="font-semibold">Pro tip:</span> Press{' '}
                  <kbd className="rounded border px-1 py-0.5 text-xs">⌘</kbd> +{' '}
                  <kbd className="rounded border px-1 py-0.5 text-xs">K</kbd> to open search
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
