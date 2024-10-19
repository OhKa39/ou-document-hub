import SellerChannelColumn from '@/components/Columns/seller_channel_column';
import DataTableOverview from '@/components/DataTableOverview/DataTableOverview';
import { getMyDocuments } from '@/lib/API/documents';
import React from 'react';

const SellerChannelDocumentsPage = async () => {
  const data = await getMyDocuments();
  console.log(data);
  return (
    <div className="mx-8 h-fit w-full pb-4">
      <p className="mb-8 mt-5 flex cursor-default text-2xl font-extrabold">Danh sách tài liệu</p>
      <DataTableOverview
        data={data.data ?? []}
        columns={SellerChannelColumn}
        title={'Tổng quan tài liệu'}
        description={'Quản lý tài liệu đã thêm'}
        searchPlaceholder={'Lọc tài liệu...'}
      />
    </div>
  );
};

export default SellerChannelDocumentsPage;
