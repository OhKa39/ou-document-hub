import CarouselImageSection from '@/components/(user)/Documents/CarouselImageSection';
import DocumentsContainer from '@/components/(user)/Documents/DocumentsContainer';
import React from 'react';

const Documents = () => {
  return (
    <div className="min-h-screen max-w-[1536px] px-12 md:px-8 lg:px-32 2xl:mx-auto">
      <CarouselImageSection />
      <DocumentsContainer />
    </div>
  );
};

export default Documents;
