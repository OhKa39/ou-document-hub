import Link from 'next/link';
import React from 'react';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons/facebook';
import 'react-social-icons/google';

type socialMediaType = {
  id: number;
  url: string;
  link: string;
};

const onClickHandler = (link: string) => {
  window.location.href = link;
};

const socialMedia: socialMediaType[] = [
  {
    id: 1,
    url: 'facebook',
    link: `/oauth2/authorization/facebook`,
  },
  {
    id: 2,
    url: 'google',
    link: `/oauth2/authorization/google`,
  },
];

const ThirdAppsButton = () => {
  // console.log(process.env.API_URL);
  return (
    <div className="my-2 flex h-[15%] w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center gap-8">
        {socialMedia.map((item, index) => (
          <SocialIcon
            key={index}
            network={item.url}
            className="cursor-pointer"
            onClick={() => onClickHandler(item.link)}
          />
        ))}
      </div>
      <h1 className="text-[color:var(--neutral-04)]">or</h1>
    </div>
  );
};

export default ThirdAppsButton;
