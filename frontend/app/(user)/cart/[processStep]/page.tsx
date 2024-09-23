import CartProcess from '@/components/(user)/Cart/CartProcess';
import ShoppingProcessType from '@/types/ShoppingProcessType';
import { notFound } from 'next/navigation';
import React from 'react';
import { TiTick } from 'react-icons/ti';

const processSteps: ShoppingProcessType[] = [
  {
    id: 1,
    step: 'Xử lý giỏ hàng',
    link: '#',
  },
  {
    id: 2,
    step: 'Thông tin thanh toán',
    link: '#',
  },
  {
    id: 3,
    step: 'Hoàn tất thanh toán',
    link: '#',
  },
];

type props = {
  params: { processStep: string };
};

const validSteps = ['process-step-1', 'process-step-2', 'process-step-3'];

const Cart = ({ params }: props) => {
  const paramsStep = params.processStep;
  let stepSplit;
  // console.log(paramsStep);
  if (!validSteps.includes(paramsStep)) return notFound();
  else {
    stepSplit = Number(paramsStep.split('-').at(-1));
  }

  return (
    <div className="mb-20 mt-10 min-h-screen max-w-[1536px] px-12 md:px-8 lg:my-20 lg:px-32 2xl:mx-auto">
      {/* header */}
      <h1 className="text-center text-4xl font-semibold">Giỏ hàng</h1>
      {/* process viewing */}
      <div className="scrollbar-hide mt-10 flex w-full gap-6 overflow-x-scroll lg:items-center lg:justify-center lg:overflow-x-hidden">
        {processSteps.map((step) => (
          <div
            key={step.id}
            className={`${step.id === stepSplit! ? 'border-b-2 border-b-[#23262F]' : step.id < stepSplit ? 'border-b-2 border-b-[var(--secondary-green)]' : ''} flex w-[256px] shrink-0 items-start gap-4 pb-6`}
          >
            <div
              className={`${step.id === stepSplit! ? 'bg-[#23262F]' : step.id < stepSplit ? 'bg-[var(--secondary-green)]' : 'bg-[#B1B5C3]'} flex h-[42px] w-[42px] items-center justify-center rounded-full text-white`}
            >
              {step.id >= stepSplit ? step.id : <TiTick size={20} />}
            </div>
            <h2
              className={`${step.id === stepSplit! ? 'text-[#23262F]' : step.id < stepSplit ? 'text-[var(--secondary-green)]' : 'text-[#B1B5C3]'} my-auto text-[18px] font-semibold text-[#23262F]`}
            >
              {step.step}
            </h2>
          </div>
        ))}
        {/* process details */}
      </div>
      <CartProcess />
    </div>
  );
};

export default Cart;
