import { DOCUMENT_ENDPOINT } from '@/constants/api_endpoint';
import { SearchCategory } from '@/types/SearchType';
import ServerFetch from '@/utils/ServerFetch';

export const getMyDocuments = async () => {
  const data = await ServerFetch(`${DOCUMENT_ENDPOINT}/me`);
  const res = await data.json();
  return res;
};

export const getDocumentByShortUrl = async (shortUrl: string) => {
  const data = await ServerFetch(`${DOCUMENT_ENDPOINT}/url/${shortUrl}`);
  const res = await data.json();
  return res;
};

export const getDocumentsByAdmin = async () => {
  const data = await ServerFetch(`${DOCUMENT_ENDPOINT}/admin`);
  const res = await data.json();
  return res;
};

type GetDocumentsParams = {
  sort?: string;
  size?: number;
  page?: number;
  [key: string]: any; // Allow other query params like minPrice, faculty, etc.
};

export const getDocuments = async (params: GetDocumentsParams = {}) => {
  try {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        query.set(key, value.toString());
      }
    }
    const response = await fetch(`${DOCUMENT_ENDPOINT}?${query.toString()}`, {
      cache: 'no-store', // Prevent caching for fresh data
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { data: [], totalPages: 1, totalElements: 0 };
  }
};

export const getDocumentById = async (id: string) => {
  const data = await ServerFetch(`${DOCUMENT_ENDPOINT}/${id}`);
  const res = await data.json();
  return res;
};

// Function to fetch search suggestions from the backend using fetch
export const fetchSearchSuggestions = async (prefix: string, category: SearchCategory, size: number) => {
  const response = await fetch(`${DOCUMENT_ENDPOINT}/suggestions?prefix=${prefix}&category=${category}&size=${size}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch search suggestions: ${response.statusText}`);
  }

  return response.json();
};
