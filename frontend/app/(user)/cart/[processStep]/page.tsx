import CartProcess from '@/components/(user)/Cart/CartProcess';
import { PROCESS_STEPS } from '@/constants';
import { notFound } from 'next/navigation';
import React from 'react';
import { TiTick } from 'react-icons/ti';

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
        {PROCESS_STEPS.map((step, index) => (
          <div
            key={index}
            className={`${index + 1 === stepSplit! ? 'border-b-2 border-b-[#23262F]' : index + 1 < stepSplit ? 'border-b-2 border-b-[var(--secondary-green)]' : ''} flex w-[256px] shrink-0 items-start gap-4 pb-6`}
          >
            <div
              className={`${index + 1 === stepSplit! ? 'bg-[#23262F]' : index + 1 < stepSplit ? 'bg-[var(--secondary-green)]' : 'bg-[#B1B5C3]'} flex h-[42px] w-[42px] items-center justify-center rounded-full text-white`}
            >
              {index + 1 >= stepSplit ? index + 1 : <TiTick size={20} />}
            </div>
            <h2
              className={`${index + 1 === stepSplit! ? 'text-[#23262F]' : index + 1 < stepSplit ? 'text-[var(--secondary-green)]' : 'text-[#B1B5C3]'} my-auto text-[18px] font-semibold text-[#23262F]`}
            >
              {step.name}
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
