import React from 'react';

import DocumentItem from '@/components/DocumentItem';
// import documents from '@/__mocks__/data/documents
import { getDocuments } from '@/lib/API/documents';
import DocumentType from '@/types/DocumentType';

const Container = async () => {
  const data = await getDocuments();
  const documents: DocumentType[] = data.data;
  return (
    <div
      className="grid grid-cols-2 items-center gap-14 md:grid-cols-3 md:gap-10 lg:grid-cols-4"
      data-testid="HomePageContainer"
    >
      {documents.map((item, idx) => (
        <DocumentItem key={idx} {...item} resolutionMobile={[281, 152]} />
      ))}
    </div>
  );
};

export default Container;
