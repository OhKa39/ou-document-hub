import React from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import Link from 'next/link';

const PaymentPage = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between font-bold">
        <p>Thẻ ngân hàng</p>
        <Link className="flex items-center gap-2" href="/my-account/payment-cards/add-payment">
          <CiCirclePlus size={24} />
          <p>Thêm thẻ ngân hàng</p>
        </Link>
      </div>
    </div>
  );
};

export default PaymentPage;
