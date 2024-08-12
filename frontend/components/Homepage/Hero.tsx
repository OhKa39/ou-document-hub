'use client';
import React from 'react';
import Image from 'next/image';
import Vector from '@/public/blue-pattern.png';

import Test1 from '@/public/test1.jpg';
import Test2 from '@/public/test2.jpg';
import Test3 from '@/public/test3.jpg';

const ImageList = [
  {
    id: 1,
    img: Test1,
    title: 'Pháp luật đại cương',
    description:
      'lorem will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    by: 'Bùi Ngọc Tuyền'
  },
  {
    id: 2,
    img: Test2,
    title: "Công nghệ phần mềm",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    by: 'Dương Hữu Thành'
  },
  {
    id: 3,
    img: Test3,
    title: 'Quản trị nhân lực',
    description:
      'Lost Boy, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    by: 'Tạ Thị Hồng Hạnh'
  },
];

const Hero = () => {
  const [imageId, setImageId] = React.useState(ImageList[0].img);
  const [title, setTitle] = React.useState(ImageList[0].title);
  const [description, setDescription] = React.useState(
    ImageList[0].description
  );
  const [by, setBy] = React.useState(ImageList[0].by)

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
        className="flex min-h-[550px] items-center justify-center bg-gray-100 duration-200 sm:min-h-[650px]"
        style={bgImage}
      >
        <div className="container pb-8 sm:pb-0">
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
                <p className="from-[#1182c5] to-[#2aa6df] bg-gradient-to-b bg-clip-text text-right text-sm text-transparent mt-2" data-testid="ByText">
                  by {by}
                </p>{' '}
              </h1>
              <p data-aos="slide-up" data-aos-duration="500" data-aos-delay="100" className="text-sm" data-testid="BookDescription">
                {description}
              </p>
              <div>
                <button
                  // onClick={handleOrderPopup}
                  className="from-[#1182c5] to-[#2aa6df] rounded-full bg-gradient-to-r px-4 py-2 text-white duration-200 hover:scale-105"
                  data-testid="OrderButton"
                >
                  Mua ngay
                </button>
              </div>
            </div>
            {/* Image section */}
            <div className="relative order-1 flex min-h-[450px] items-center justify-center sm:order-2 sm:min-h-[450px]">
              <div className="flex h-[300px] items-center justify-center overflow-hidden sm:h-[450px]">
                <Image
                  data-aos="zoom-in"
                  data-aos-once="true"
                  src={imageId}
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
                    src={item.img}
                    onClick={() => {
                      setImageId(item.id === 1 ? Test1 : item.id === 2 ? Test2 : Test3);
                      setTitle(item.title);
                      setDescription(item.description);
                      setBy(item.by)
                    }}
                    alt="biryani img"
                    className="inline-block h-[100px] max-w-[100px] object-contain duration-200 hover:scale-110 cursor-pointer"
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
