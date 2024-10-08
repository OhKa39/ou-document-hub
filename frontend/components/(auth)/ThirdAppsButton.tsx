'use client';
import { SOCIAL_MEDIAS } from '@/constants';
import React from 'react';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons/facebook';
import 'react-social-icons/google';

const onClickHandler = (link: string) => {
  window.location.href = link;
};

const ThirdAppsButton = () => {
  // console.log(process.env.API_URL);
  return (
    <div className="my-2 flex h-[15%] w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center gap-8">
        {SOCIAL_MEDIAS.map((item, index) => (
          <SocialIcon
            key={index}
            network={item.url}
            className="cursor-pointer"
            onClick={() => onClickHandler(item.link)}
          />
        ))}
      </div>
      <p className="text-[color:var(--neutral-04)]">or</p>
    </div>
  );
};

export default ThirdAppsButton;
