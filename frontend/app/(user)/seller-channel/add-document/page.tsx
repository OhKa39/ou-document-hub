import DocumentForm from '@/components/Forms/DocumentForm';
import { getFaculties } from '@/lib/API/faculties';
import { getShippingAddresses } from '@/lib/API/shipping_addresses';
import React from 'react';

const AddDocumentPage = async () => {
  const dataFaculty = getFaculties();
  const dataShippingAddress = getShippingAddresses();
  const [Faculty, ShippingAddress] = await Promise.all([dataFaculty, dataShippingAddress]);
  return (
    <div className="mx-8 h-fit w-full pb-4">
      <p className="mb-8 mt-5 flex cursor-default text-2xl font-extrabold">Thêm tài liệu</p>
      <div className="">
        <DocumentForm faculties={Faculty.data?.content ?? []} shippingAddresses={ShippingAddress.data?.content ?? []} />
      </div>
    </div>
  );
};

export default AddDocumentPage;
