import dynamic from 'next/dynamic';
import HeroLoading from '@/components/Loading/HeroLoading';
import DocumentMultiCarouselLoading from '@/components/Loading/DocumentMultiCarouselLoading';
import { Suspense } from 'react';

const DynamicHero = dynamic(() => import('@/components/Homepage/Hero'), {
  loading: () => <HeroLoading />,
  ssr: false,
});

const DynamicCarousel = dynamic(() => import('@/components/Homepage/DocumentMultiCarousel'), {
  loading: () => <DocumentMultiCarouselLoading />,
  ssr: false,
});

const DynamicDocumentGroup = dynamic(() => import('@/components/Homepage/DocumentGroup'), {
  loading: () => <p>Loading...</p>,
});

const DynamicDocumentsSuggest = dynamic(() => import('@/components/Homepage/DocumentsSuggest'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <main>
      {/* <HeroLoading /> */}
      <DynamicHero />
      {/* <DocumentMultiCarouselLoading /> */}
      <DynamicCarousel />
      <DynamicDocumentGroup />
      <DynamicDocumentsSuggest />
    </main>
  );
}
