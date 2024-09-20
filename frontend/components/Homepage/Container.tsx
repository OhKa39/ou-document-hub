import React from 'react';

import DocumentItem from '@/components/DocumentItem';
import documents from '@/__mocks__/data/documents';

const Container = () => {
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
