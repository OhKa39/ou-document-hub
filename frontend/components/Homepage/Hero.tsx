'use client';
import React from 'react';
import Image from 'next/image';
import Vector from '@/public/blue-pattern.webp';

import Book1 from '@/public/Book1.webp';
import Book2 from '@/public/Book2.webp';
import Book3 from '@/public/Book3.webp';

const ImageList = [
  {
    id: 1,
    img: Book1,
    title: 'Pháp luật đại cương',
    description:
      'lorem will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    by: 'Bùi Ngọc Tuyền',
  },
  {
    id: 2,
    img: Book2,
    title: 'Công nghệ phần mềm',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    by: 'Dương Hữu Thành',
  },
  {
    id: 3,
    img: Book3,
    title: 'Quản trị nhân lực',
    description:
      'Lost Boy, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    by: 'Tạ Thị Hồng Hạnh',
  },
];

const Hero = () => {
  const [imageId, setImageId] = React.useState(ImageList[0].img);
  const [title, setTitle] = React.useState(ImageList[0].title);
  const [description, setDescription] = React.useState(ImageList[0].description);
  const [by, setBy] = React.useState(ImageList[0].by);

  const bgImage = {
    backgroundImage: `url(${Vector.src})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    // height: "100%",
    width: '100%',
  };

  return (
    <>
      <div
        className="relative flex min-h-[550px] max-w-[1536px] items-center justify-center bg-gray-100 duration-200 sm:min-h-[650px] 2xl:mx-auto"
        // style={bgImage}
      >
        <div className="absolute bottom-0 w-full" style={{ aspectRatio: Vector.width / Vector.height }}>
          <Image src={Vector} alt="Background" fill priority />
        </div>
        <div className="container z-[99] pb-8 sm:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* text content section */}
            <div
              data-aos-once="true"
              className="order-2 flex flex-col justify-center gap-4 pt-12 text-center sm:order-1 sm:pt-0 sm:text-left"
            >
              <h1
                data-aos="zoom-out"
                data-aos-duration="500"
                data-aos-once="true"
                className="text-5xl font-bold sm:text-6xl lg:text-7xl"
                data-testid="Title"
              >
                {title}
                <p
                  className="mt-2 bg-gradient-to-b from-[#1182c5] to-[#2aa6df] bg-clip-text text-right text-sm text-transparent"
                  data-testid="ByText"
                >
                  by {by}
                </p>{' '}
              </h1>
              <p
                data-aos="slide-up"
                data-aos-duration="500"
                data-aos-delay="100"
                className="text-sm"
                data-testid="BookDescription"
              >
                {description}
              </p>
              <div>
                <button
                  // onClick={handleOrderPopup}
                  className="rounded-full bg-gradient-to-r from-[#1182c5] to-[#2aa6df] px-4 py-2 text-white duration-200 hover:scale-105"
                  data-testid="OrderButton"
                  aria-label="Order"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
            {/* Image section */}
            <div className="relative order-1 flex min-h-[450px] items-center justify-center sm:order-2 sm:ml-8 sm:min-h-[450px] md:ml-6">
              <div className="flex h-[300px] items-center justify-center overflow-hidden sm:h-[450px]">
                <Image
                  data-aos="zoom-in"
                  data-aos-once="true"
                  src={imageId}
                  priority
                  alt="biryani img"
                  className="mx-auto h-[300px] w-[300px] object-contain sm:h-[450px] sm:w-[450px] sm:scale-100"
                  data-testid="MainBook"
                />
              </div>
              <div className="absolute -bottom-[40px] flex justify-center gap-4 rounded-full bg-white lg:-right-1 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col lg:py-2">
                {ImageList.map((item) => (
                  <Image
                    key={item.id}
                    data-aos="zoom-in"
                    data-aos-once="true"
                    priority
                    src={item.img}
                    onClick={() => {
                      setImageId(item.id === 1 ? Book1 : item.id === 2 ? Book2 : Book3);
                      setTitle(item.title);
                      setDescription(item.description);
                      setBy(item.by);
                    }}
                    alt="biryani img"
                    className="inline-block h-[100px] max-w-[100px] cursor-pointer object-contain duration-200 hover:scale-110"
                    data-testid="Books"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
