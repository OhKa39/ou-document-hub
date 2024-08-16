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
    <div className="bg-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900" data-testid="Title">
          Tài Liệu Theo Ngành
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documentGroupItems.map((item) => (
            <div
              key={item.id}
              className="group relative h-64 overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl"
              style={{ backgroundColor: getBackgroundColor(item.id) }}
              data-testid="DocumentGroupItem"
            >
              <div className="absolute inset-0 z-10 p-6">
                <h2 className="mb-2 text-2xl font-bold text-white">{item.name}</h2>
                <Link
                  href={item.link}
                  className="inline-block border-b-2 border-white font-semibold text-white transition-colors duration-300 hover:border-gray-200 hover:text-gray-200"
                >
                  Bộ Sưu Tập -&gt;
                </Link>
              </div>
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-105">
                <Image
                  src={item.image}
                  alt={`${item.name} image`}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="p-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getBackgroundColor(id: number) {
  switch (id) {
    case 1:
      return '#2563eb';
    case 2:
      return '#10b981';
    case 3:
      return '#f59e0b';
    default:
      return '#374151';
  }
}

export default DocumentGroup;
