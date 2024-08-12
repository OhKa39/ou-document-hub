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
    <div className="align-center flex min-h-[665px] justify-center bg-[var(--neutral-07)] md:min-h-[249px]">
      <div className="container md:px-8 lg:px-32">
        {/* header-footer */}
        <div className="align-center flex flex-col justify-center text-center md:flex-row md:justify-between md:py-4">
          <div className="mt-[50px] flex flex-col md:flex-row md:gap-8">
            <h1 className="relative pb-6 text-2xl font-bold text-[var(--neutral-01)] after:mx-auto after:mt-5 after:block after:h-[2px] after:w-6 after:bg-white md:pb-0 md:after:absolute md:after:-right-5 md:after:-top-4 md:after:h-6 md:after:w-[2px]" data-testid="Title">
              OUDocumentHub
            </h1>
            <h3 className="inline-block text-base font-semibold text-[var(--neutral-01)] md:my-auto" data-testid="VietnamseTitle">
              Hệ thống quản lý tài liệu OU
            </h3>
          </div>
          <ul className="mt-6 flex flex-col gap-6 md:mt-[52px] md:flex-row">
            {headerItems.map((item, idx) => (
              <li key={idx} className="md:py-auto text-[var(--neutral-01)]" data-testid="NavigationItem">
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* line */}
        <div className="mx-auto mt-8 h-[1px] w-[100%] bg-white"></div>
        {/* end-of-footer */}
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="px-auto order-1 mt-6 flex gap-6 text-white md:order-2 md:mt-2">
            <FaInstagram size={36} className="cursor-pointer" data-testid="Instagram"/>
            <FaFacebook size={32} className="cursor-pointer" data-testid="Facebook"/>
            <FaGithub size={32} className="cursor-point" data-testid='Github'/>
          </div>
          <div className="px-auto order-2 mt-6 flex flex-col text-white md:order-1 md:mt-2 md:flex-row md:justify-between md:gap-6">
            <div className="aligh-center flex justify-center gap-6">
              <h3>Privacy Policy</h3>
              <h3>Terms of Use</h3>
            </div>
            <h4 className="mt-8 text-center text-[#a59999] md:mt-0">Copyright © 2024 Ohka39. All rights reserved.</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
