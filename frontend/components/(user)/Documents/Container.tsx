import documents from '@/__mocks__/data/documents';
import DocumentItem from '@/components/DocumentItem';
import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Container = () => {
  return (
    <div className="flex h-fit w-full flex-col gap-8 space-y-6">
      {/* header section */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Kho tài liệu</h1>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Sắp xếp theo</h1>
          <FaChevronDown size={20} />
        </div>
      </div>
      {/* container */}
      <div className="grid w-full grid-cols-2 gap-14 lg:grid-cols-3 lg:gap-0">
        {documents.map((item, idx) => (
          <DocumentItem key={idx} {...item} resolutionMobile={[281, 152]} />
        ))}
      </div>
    </div>
  );
};

export default Container;
