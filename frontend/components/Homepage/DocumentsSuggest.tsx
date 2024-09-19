import React from 'react';
import Container from './Container';

const DocumentsSuggest = () => {
  return (
    <div className="relative mx-8 my-8 h-fit max-w-[1536px] lg:ml-32 2xl:mx-auto">
      <h1 className="flex w-full justify-center text-3xl font-bold lg:block" data-testid="Title">
        Tài Liệu Gợi Ý
      </h1>
      <div className="mt-2">
        <Container />
      </div>
    </div>
  );
};

export default DocumentsSuggest;
