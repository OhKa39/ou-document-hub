import DocumentGroup from '@/components/Homepage/DocumentGroup';
import DocumentMultiCarousel from '@/components/Homepage/DocumentMultiCarousel';
import Hero from '@/components/Homepage/Hero';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <Hero />
      <DocumentMultiCarousel />
      <DocumentGroup />
    </main>
  );
}
