export type SearchCategory = 'all' | 'documents' | 'sellers';

export type SearchResult = {
  id: string;
  title: string;
  category: string;
  url: string;
  image: string;
  type: 'document' | 'seller';
};
