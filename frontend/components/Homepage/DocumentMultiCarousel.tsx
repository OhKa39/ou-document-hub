'use client';
import React from 'react';
import DocumentItem from '../DocumentItem';
import CustomDot from '../Carousel/CustomDot';
import Carousel from 'react-multi-carousel';
import Book1 from '@/public/Book1.webp';
import Book2 from '@/public/Book2.webp';
import Book3 from '@/public/Book3.webp';
import 'react-multi-carousel/lib/styles.css';
import CustomRightArrow from '../Carousel/CustomRightArrow';
import CustomLeftArrow from '../Carousel/CustomLeftArrow';

const documentItems = [
  {
    id: 1,
    name: 'Giáo trình pháp luật đại cương',
    price: 299000,
    image: Book1,
    tag: 'New',
  },
  {
    id: 2,
    name: 'Sách công nghệ phần mềm',
    price: 299000,
    image: Book2,
    tag: 'New',
  },
  {
    id: 3,
    name: 'Sách quản trị nhân lực',
    price: 299000,
    image: Book3,
    tag: 'New',
  },
  {
    id: 4,
    name: 'Giáo trình pháp luật đại cương',
    price: 299000,
    image: Book1,
    tag: 'New',
  },
  {
    id: 5,
    name: 'Giáo trình pháp luật đại cương',
    price: 299000,
    image: Book1,
    tag: 'New',
  },
  {
    id: 6,
    name: 'Giáo trình pháp luật đại cương',
    price: 299000,
    image: Book1,
    tag: 'New',
  },
  {
    id: 7,
    name: 'Giáo trình pháp luật đại cương',
    price: 299000,
    image: Book1,
    tag: 'New',
  },
  {
    id: 8,
    name: 'Giáo trình pháp luật đại cương',
    price: 299000,
    image: Book1,
    tag: 'New',
  },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
};

const DocumentMultiCarousel = () => {
  return (
    <div className="relative my-12 ml-8 h-[440px] max-w-[1536px] md:h-[500px] lg:ml-32 2xl:mx-auto">
      <h1 className="text-3xl font-bold md:text-3xl" data-testid="Title">
        Tài Liệu Mới
      </h1>
      <div className="mt-6">
        <Carousel
          responsive={responsive}
          // ssr
          swipeable
          draggable
          showDots
          rewindWithAnimation
          // autoPlay
          infinite
          // autoPlaySpeed={6000}
          removeArrowOnDeviceType={['tablet', 'mobile']}
          dotListClass="h-9 w-[90%] absolute top-0 !flex !justify-end !items-center !py-2"
          renderDotsOutside
          containerClass="w-full"
          customDot={<CustomDot />}
          itemClass="mr-20 lg:mr-12"
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          data-testid="carousel"
          partialVisible={false}
          // centerMode
        >
          {documentItems.map((item) => (
            <DocumentItem key={item.id} {...item} data-testid="DocumentItem" />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default DocumentMultiCarousel;
