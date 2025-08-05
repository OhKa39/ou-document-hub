import React from 'react';
import DocumentItem from '@/components/DocumentItem';
import { getDocuments } from '@/lib/API/documents';
import DocumentType from '@/types/DocumentType';

const Container = async () => {
  // Fetch the 8 most recent documents, sorted by created_at descending
  const data = await getDocuments({ sort: 'newest', size: 20, page: 0 });
  const documents: DocumentType[] = Array.isArray(data.data) ? data.data : [];

  return (
    <div
      className="grid grid-cols-2 items-center gap-14 md:grid-cols-3 md:gap-10 lg:-ml-4 lg:grid-cols-4"
      data-testid="HomePageContainer"
    >
      {documents.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">Không có tài liệu mới.</p>
      ) : (
        documents.map((item) => <DocumentItem key={item.documentId} {...item} resolutionMobile={[281, 152]} />)
      )}
    </div>
  );
};

export default Container;
