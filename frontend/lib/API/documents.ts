import { DOCUMENT_ENDPOINT } from '@/constants/api_endpoint';
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

export const getDocuments = async () => {
  const data = await ServerFetch(`${DOCUMENT_ENDPOINT}`);
  const res = await data.json();
  return res;
};

export const getDocumentById = async (id: string) => {
  const data = await ServerFetch(`${DOCUMENT_ENDPOINT}/${id}`);
  const res = await data.json();
  return res;
};
