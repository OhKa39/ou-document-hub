import Link from 'next/link';
import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';

type headerItemType = {
  id: Number;
  link: string;
  name: string;
};

const headerItems: headerItemType[] = [
  {
    id: 1,
    link: '#',
    name: 'Trang chủ',
  },
  {
    id: 2,
    link: '#',
    name: 'Kho tài liệu',
  },
  {
    id: 3,
    link: '#',
    name: 'Kênh người bán',
  },
  {
    id: 4,
    link: '#',
    name: 'About website',
  },
];
const Footer = () => {
  return (
    <div className="align-center flex min-h-[665px] justify-center bg-[var(--neutral-07)] lg:min-h-[249px]">
      <div className="container lg:px-32">
        {/* header-footer */}
        <div className="align-center flex flex-col justify-center text-center lg:flex-row lg:justify-between lg:py-4">
          <div className="mt-[50px] flex flex-col lg:flex-row lg:gap-8">
            <h1
              className="relative pb-6 text-2xl font-bold text-[var(--neutral-01)] after:mx-auto after:mt-5 after:block after:h-[2px] after:w-6 after:bg-white lg:pb-0 lg:after:absolute lg:after:-right-5 lg:after:-top-4 lg:after:h-6 lg:after:w-[2px]"
              data-testid="Title"
            >
              OUDocumentHub
            </h1>
            <h3
              className="inline-block text-base font-semibold text-[var(--neutral-01)] lg:my-auto"
              data-testid="VietnamseTitle"
            >
              Hệ thống quản lý tài liệu OU
            </h3>
          </div>
          <ul className="mt-6 flex flex-col gap-6 lg:mt-[52px] lg:flex-row">
            {headerItems.map((item, idx) => (
              <li key={idx} className="lg:py-auto text-[var(--neutral-01)]" data-testid="NavigationItem">
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* line */}
        <div className="mx-auto mt-8 h-[1px] w-[100%] bg-white"></div>
        {/* end-of-footer */}
        <div className="flex flex-col items-center lg:flex-row lg:justify-between">
          <div className="px-auto order-1 mt-6 flex gap-6 text-white lg:order-2 lg:mt-2">
            <FaInstagram size={36} className="cursor-pointer" data-testid="Instagram" />
            <FaFacebook size={32} className="cursor-pointer" data-testid="Facebook" />
            <FaGithub size={32} className="cursor-pointer" data-testid="Github" />
          </div>
          <div className="px-auto order-2 mt-6 flex flex-col text-white lg:order-1 lg:mt-2 lg:flex-row lg:justify-between lg:gap-6">
            <div className="aligh-center flex justify-center gap-6">
              <h3>Privacy Policy</h3>
              <h3>Terms of Use</h3>
            </div>
            <h4 className="mt-8 text-center text-[#a59999] lg:mt-0">Copyright © 2024 Ohka39. All rights reserved.</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
