import Link from 'next/link';
import { getFaculties } from '@/lib/API/faculties';
import { getShippingAddresses } from '@/lib/API/shipping_addresses';
import DraftDocumentDetail from '@/components/(user)/DocumentPreview/DraftDocumentDetail';

const DraftPreviewPage = async () => {
  return (
    <div className="min-h-screen max-w-[1536px] px-12 pb-8 md:px-8 lg:px-32 2xl:mx-auto">
      <div className="flex items-center gap-4 py-4 font-semibold">
        <Link href="/" className="text-sm text-gray-600 lg:text-base">
          Trang chủ {'>'}
        </Link>
        <Link href="#" className="text-sm text-gray-600 lg:text-base">
          Kho tài liệu {'>'}
        </Link>
        <p className="text-sm lg:text-base">Xem trước nháp</p>
      </div>
      <DraftDocumentDetail />
    </div>
  );
};

export default DraftPreviewPage;
