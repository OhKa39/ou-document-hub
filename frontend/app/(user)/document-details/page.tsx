import DocumentAddition from '@/components/(user)/DocumentInformation/DocumentAddition';
import DocumentDetails from '@/components/(user)/DocumentInformation/DocumentDetails';
import Link from 'next/link';
import React from 'react';

const DocumentInformation = () => {
  return (
    <div className="min-h-screen max-w-[1536px] px-12 md:px-8 lg:px-32 2xl:mx-auto">
      <div className="flex items-center gap-4 py-4 font-semibold">
        <Link href="/" className="text-gray-600">
          Trang chủ {'>'}
        </Link>
        <Link href="#" className="text-gray-600">
          Kho tài liệu {'>'}
        </Link>
        <p>Tài liệu </p>
      </div>
      {/* document detail section */}
      <DocumentDetails />
      {/* Addtion info section */}
      <DocumentAddition />
    </div>
  );
};

export default DocumentInformation;
