import { useEffect, useState } from 'react';

const DocumentMultiCarouselLoading = () => {
  return (
    <div className="relative my-8 ml-8 h-[440px] max-w-[1536px] md:h-[500px] lg:ml-32 2xl:mx-auto">
      <h1 className="text-3xl font-bold md:text-3xl">Tài Liệu Mới</h1>
      <div className="scrollbar-hide mt-6 flex w-full overflow-y-hidden overflow-x-scroll">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="mr-12 h-[412px] w-[231px] flex-shrink-0 animate-pulse rounded-lg bg-gray-200 md:h-[459px] md:w-[262px] lg:mx-auto"
            >
              <div className="h-[75%] bg-gray-300"></div>
              <div className="mt-2 h-[30%] space-y-2">
                <div className="mx-auto h-4 w-[80%] bg-gray-300"></div>
                <div className="mx-auto h-4 w-[40%] bg-gray-300"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DocumentMultiCarouselLoading;
