import DocumentGroup from '@/components/Homepage/DocumentGroup';
import DocumentMultiCarousel from '@/components/Homepage/DocumentMultiCarousel';
import Hero from '@/components/Homepage/Hero';
import dynamic from 'next/dynamic';

const DynamicHero = dynamic(() => import('@/components/Homepage/Hero'), {
  loading: () => <p>Loading...</p>,
});

const DynamicCarousel = dynamic(() => import('@/components/Homepage/DocumentMultiCarousel'), {
  loading: () => <p>Loading...</p>,
});

const DynamicDocumentGroup = dynamic(() => import('@/components/Homepage/DocumentGroup'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <main>
      <DynamicHero />
      <DynamicCarousel />
      <DynamicDocumentGroup />
    </main>
  );
}
