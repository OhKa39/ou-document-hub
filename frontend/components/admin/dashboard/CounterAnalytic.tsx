import React from 'react';

import { DASHBOARD_ITEMS } from '@/constants';
import Image from 'next/image';

const CounterAnalytic = () => {
  return (
    <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
      {DASHBOARD_ITEMS.map((item, index) => (
        <div
          key={index}
          className="flex h-[161px] min-w-[262px] flex-col items-center justify-center gap-8 rounded-xl bg-white"
        >
          <div className="mt-1 flex w-[90%] items-center justify-between gap-2">
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-[#202224]/70">{item.name}</p>
              <p className="text-2xl font-bold">65555</p>
            </div>
            <Image src={item.iconLink} alt="dashboard item icon" width={60} height={60} />
          </div>
          <div className="flex w-[90%] items-center gap-2">
            <Image src="/ic-trending-up-24px.svg" alt="trending icon" width={24} height={24} />
            <p>
              <span className="text-[#00B69B]">9.5% </span>
              Tăng so với tuần trước
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterAnalytic;
