import DocumentReviewColumn from '@/components/Columns/document_review_column';
import SellerChannelColumn from '@/components/Columns/seller_channel_column';
import DataTableOverview from '@/components/DataTableOverview/DataTableOverview';
import { getDocumentsByAdmin } from '@/lib/API/documents';
import React from 'react';

const DocumentReviewPage = async () => {
  const data = await getDocumentsByAdmin();
  return (
    <div className="h-full bg-[#F5F6FA] px-8">
      <p className="py-6 text-3xl font-extrabold">Document Review</p>
      <DataTableOverview
        data={data.data}
        columns={DocumentReviewColumn}
        title={'Tổng quan về xem xét tài liệu'}
        description={'Giám sát tài liệu của người dùng'}
        searchPlaceholder={'Lọc tài liệu...'}
      />
    </div>
  );
};

export default DocumentReviewPage;
