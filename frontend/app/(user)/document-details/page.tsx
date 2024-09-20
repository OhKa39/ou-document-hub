import DocumentAddition from '@/components/(user)/DocumentInformation/DocumentAddition';
import DocumentDetails from '@/components/(user)/DocumentInformation/DocumentDetails';
import React from 'react';

const DocumentInformation = () => {
  return (
    <div className="min-h-screen max-w-[1536px] px-12 md:px-8 lg:px-32 2xl:mx-auto">
      {/* document detail section */}
      <DocumentDetails />
      {/* Addtion info section */}
      <DocumentAddition />
    </div>
  );
};

export default DocumentInformation;
