import CarouselImageSection from '@/components/(user)/Documents/CarouselImageSection';
import Container from '@/components/(user)/Documents/Container';
import DocumentsFilter from '@/components/(user)/Documents/DocumentsFilter';
import React from 'react';

const Documents = () => {
  return (
    <div className="min-h-screen max-w-[1536px] px-12 md:px-8 lg:px-32 2xl:mx-auto">
      <CarouselImageSection />
      <div className="mb-[100px] mt-[60px] flex flex-col gap-6 lg:flex-row">
        {/* filter section */}
        <DocumentsFilter />
        {/* document container section */}
        <Container />
      </div>
    </div>
  );
};

export default Documents;
