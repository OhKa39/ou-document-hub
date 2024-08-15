import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import IT from '@/public/IT.webp';
import Law from '@/public/law.webp';
import Economy from '@/public/economy.webp';

type DocumentGroupItemType = {
  id: number;
  name: string;
  link: string;
  image: any;
};

const documentGroupItems = [
  {
    id: 1,
    name: 'Công nghệ thông tin',
    link: '#',
    image: IT,
  },
  {
    id: 2,
    name: 'Kinh tế',
    link: '#',
    image: Economy,
  },
  {
    id: 3,
    name: 'Luật',
    link: '#',
    image: Law,
  },
];

const DocumentGroup = () => {
  return (
    <div>
      <div className="relative mx-8 my-12 h-[864px] max-w-[1536px] lg:ml-32 lg:h-[804px] 2xl:mx-auto">
        {/* Title */}
        <h1 className="flex w-full justify-center text-2xl font-bold md:text-3xl lg:block" data-testid="Title">
          Tài Liệu Theo Ngành
        </h1>
        {/* Document Group */}
        <div className="mt-2 grid grid-cols-1 place-items-center gap-2 lg:grid-cols-2">
          {/* item 1 */}
          <div
            className="relative flex h-[377px] w-[311px] flex-col justify-end bg-[#F3F5F7] lg:h-[664px] lg:w-[548px]"
            data-testid="DocumentGroupItem"
          >
            {/* header and link */}
            <div className="mb-[10%] ml-6 gap-2">
              <h1 className="text-2xl font-bold">{documentGroupItems[0].name}</h1>
              <Link href={documentGroupItems[0].name} className="border-b-2 border-black font-semibold lg:text-xl">
                Bộ Sưu Tập -{'>'}
              </Link>
            </div>
            {/* Document Group Image */}
            <div className="absolute left-10 top-5 h-[70%] w-[80%] drop-shadow-lg">
              <Image src={documentGroupItems[0].image} alt="Document Group Image" fill priority />
            </div>
          </div>
          {/* Sub Group */}
          <div className="grid grid-rows-1 gap-2 lg:grid-rows-2 lg:gap-6">
            {/* item 2 */}
            <div
              className="relative flex h-[180px] w-[311px] flex-col justify-end bg-[#F3F5F7] lg:h-[320px] lg:w-[548px]"
              data-testid="DocumentGroupItem"
            >
              {/* header and link */}
              <div className="mb-[10%] ml-6 gap-1">
                <h1 className="text-2xl font-bold">{documentGroupItems[1].name}</h1>
                <Link href={documentGroupItems[1].link} className="border-b-2 border-black font-semibold lg:text-xl">
                  Bộ Sưu Tập -{'>'}
                </Link>
              </div>
              {/* Document Group Image */}
              <div className="absolute bottom-2 right-2 h-[80%] w-[55%] drop-shadow-lg">
                <Image src={documentGroupItems[1].image} alt="Document Group Image" fill priority />
              </div>
            </div>
            {/* item 3 */}
            <div
              className="relative flex h-[180px] w-[311px] flex-col justify-end bg-[#F3F5F7] lg:h-[320px] lg:w-[548px]"
              data-testid="DocumentGroupItem"
            >
              {/* header and link */}
              <div className="mb-[10%] ml-6 gap-1">
                <h1 className="text-2xl font-bold">{documentGroupItems[2].name}</h1>
                <Link href={documentGroupItems[2].link} className="border-b-2 border-black font-semibold lg:text-xl">
                  Bộ Sưu Tập -{'>'}
                </Link>
              </div>
              {/* Document Group Image */}
              <div className="absolute bottom-2 right-1 h-[80%] w-[55%] drop-shadow-lg">
                <Image src={documentGroupItems[2].image} alt="Document Group Image" fill priority />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGroup;
