import DocumentDetails from '@/components/(user)/DocumentInformation/DocumentDetails';
import { getDocumentByShortUrl } from '@/lib/API/documents';
import Link from 'next/link';
import React from 'react';

const DocumentInformation = async ({ params }: { params: { document_shorturl: string } }) => {
  const { document_shorturl } = params;
  const data = await getDocumentByShortUrl(document_shorturl);
  return (
    <>
      <div className="flex items-center gap-4 py-4 font-semibold">
        <Link href="/" className="text-sm text-gray-600 lg:text-base">
          Trang chủ {'>'}
        </Link>
        <Link href="#" className="text-sm text-gray-600 lg:text-base">
          Kho tài liệu {'>'}
        </Link>
        <p className="text-sm lg:text-base">Tài liệu </p>
      </div>
      {/* document detail section */}
      <DocumentDetails document={data.data} />
    </>
  );
};

export default DocumentInformation;
