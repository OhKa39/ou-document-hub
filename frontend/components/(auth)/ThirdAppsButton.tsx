import React from 'react';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons/facebook';
import 'react-social-icons/google';

type socialMediaType = {
  id: number;
  url: string;
};

const socialMedia: socialMediaType[] = [
  {
    id: 1,
    url: 'facebook',
  },
  {
    id: 2,
    url: 'google',
  },
];

const ThirdAppsButton = () => {
  return (
    <div className="my-2 flex h-[15%] w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center gap-8">
        {socialMedia.map((item, index) => (
          <SocialIcon key={index} network={item.url} className="cursor-pointer" />
        ))}
      </div>
      <h1 className="text-[color:var(--neutral-04)]">or</h1>
    </div>
  );
};

export default ThirdAppsButton;
