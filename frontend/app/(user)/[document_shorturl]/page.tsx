import DocumentAddition from '@/components/(user)/DocumentInformation/DocumentAddition';
import DocumentDetails from '@/components/(user)/DocumentInformation/DocumentDetails';
import { getDocumentByShortUrl } from '@/lib/API/documents';
import Link from 'next/link';
import React from 'react';

const DocumentInformation = async ({ params }: { params: { document_shorturl: string } }) => {
  const { document_shorturl } = params;
  const data = await getDocumentByShortUrl(document_shorturl);
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
      <DocumentDetails document={data.data} />
      {/* Addtion info section */}
      <DocumentAddition />
    </div>
  );
};

export default DocumentInformation;
