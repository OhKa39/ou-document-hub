'use client';
import React from 'react';
import DocumentItem from '../DocumentItem';
import CustomDot from '../Carousel/CustomDot';
import Carousel from 'react-multi-carousel';
import Book1 from '@/public/Book1.jpg';
import Book2 from '@/public/Book2.jpg';
import Book3 from '@/public/Book3.jpg';
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
    items: 5,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const DocumentMultiCarousel = () => {
  return (
    <div className="relative my-12 ml-8 h-[554px] lg:ml-32">
      <h1 className="text-2xl font-bold lg:text-3xl" data-testid="Title">
        Tài Liệu Mới
      </h1>
      <div className="mt-6">
        <Carousel
          responsive={responsive}
          ssr={true}
          swipeable={true}
          showDots={true}
          autoPlay={true}
          infinite={true}
          autoPlaySpeed={6000}
          removeArrowOnDeviceType={['tablet', 'mobile']}
          dotListClass="h-9 w-[90%] absolute top-1 !flex !justify-end !align-center !py-2"
          renderDotsOutside={true}
          containerClass="w-full"
          customDot={<CustomDot />}
          itemClass="mx-5 h-[412px] w-[100px] md:h-[459px] md:w-[262px]"
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          data-testid="carousel"
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
