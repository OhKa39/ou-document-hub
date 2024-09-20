import React from 'react';
import DocumentsFilter from './DocumentsFilter';
import Container from './Container';

const DocumentsContainer = () => {
  return (
    <div className="mb-[100px] mt-[60px] flex flex-col gap-6 lg:flex-row">
      {/* filter section */}
      <DocumentsFilter />
      {/* document container section */}
      <Container />
    </div>
  );
};

export default DocumentsContainer;
