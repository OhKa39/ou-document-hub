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
      <div className="relative mx-8 my-12 h-[730px] max-w-[1536px] md:ml-32 md:h-[500px] lg:h-[600px] 2xl:mx-auto">
        {/* Title */}
        <h1 className="flex w-full justify-center text-2xl font-bold md:block md:text-3xl" data-testid="Title">
          Tài Liệu Theo Ngành
        </h1>
        {/* Document Group */}
        <div className="mt-2 grid h-[98%] w-full grid-rows-2 place-items-center gap-2 md:grid-cols-2 md:grid-rows-none">
          {/* item 1 */}
          <div
            className="relative flex h-full w-[80%] flex-col justify-end bg-[#F3F5F7] md:h-full md:w-full"
            data-testid="DocumentGroupItem"
          >
            {/* header and link */}
            <div className="mb-[10%] ml-[10%] gap-2">
              <h1 className="text-2xl font-bold">{documentGroupItems[0].name}</h1>
              <Link href={documentGroupItems[0].name} className="border-b-2 border-black font-semibold md:text-xl">
                Bộ Sưu Tập -{'>'}
              </Link>
            </div>
            {/* Document Group Image */}
            <div
              className="absolute left-1/2 top-[1%] h-[70%] -translate-x-1/2 drop-shadow-lg"
              style={{ aspectRatio: documentGroupItems[0].image.width / documentGroupItems[0].image.height }}
            >
              <Image
                src={documentGroupItems[0].image}
                alt="Document Group Image"
                fill
                // priority
              />
            </div>
          </div>
          {/* Sub Group */}
          <div className="md:grid-rows-0 grid h-full w-[80%] grid-rows-2 gap-2 md:w-full">
            {/* item 2 */}
            <div
              className="relative flex h-full w-full flex-col justify-end bg-[#F3F5F7]"
              data-testid="DocumentGroupItem"
            >
              {/* header and link */}
              <div className="mb-[10%] ml-[10%] gap-1">
                <h1 className="text-2xl font-bold">{documentGroupItems[1].name}</h1>
                <Link href={documentGroupItems[1].link} className="border-b-2 border-black font-semibold md:text-xl">
                  Bộ Sưu Tập -{'>'}
                </Link>
              </div>
              {/* Document Group Image */}
              <div
                className="absolute bottom-[10%] right-[5%] h-[80%] drop-shadow-lg"
                style={{
                  aspectRatio: documentGroupItems[1].image.width / documentGroupItems[1].image.height,
                }}
              >
                <Image
                  src={documentGroupItems[1].image}
                  alt="Document Group Image"
                  fill
                  // priority
                />
              </div>
            </div>
            {/* item 3 */}
            <div
              className="relative flex h-full w-full flex-col justify-end bg-[#F3F5F7]"
              data-testid="DocumentGroupItem"
            >
              {/* header and link */}
              <div className="mb-[10%] ml-[10%] gap-1">
                <h1 className="text-2xl font-bold">{documentGroupItems[2].name}</h1>
                <Link href={documentGroupItems[2].link} className="border-b-2 border-black font-semibold md:text-xl">
                  Bộ Sưu Tập -{'>'}
                </Link>
              </div>
              {/* Document Group Image */}
              <div
                className="absolute bottom-[10%] right-[5%] h-[80%] drop-shadow-lg"
                style={{
                  aspectRatio: documentGroupItems[2].image.width / documentGroupItems[2].image.height,
                }}
              >
                <Image
                  src={documentGroupItems[2].image}
                  alt="Document Group Image"
                  fill
                  // priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGroup;
