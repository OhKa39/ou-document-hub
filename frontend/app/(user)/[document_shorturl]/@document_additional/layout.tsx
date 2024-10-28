'use client';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegment } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const params = useParams();
  const documentUrl = params.document_shorturl;
  console.log(segment);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <Link
            href={`/${documentUrl}`}
            scroll={false}
            className={`border-b-2 px-1 py-4 text-base font-medium ${
              !segment
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Additional Info
          </Link>
          <Link
            href={`/${documentUrl}/comments`}
            scroll={false}
            className={`border-b-2 px-1 py-4 text-base font-medium ${
              segment === 'comments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Comments
          </Link>
          <Link
            href={`/${documentUrl}/reviews`}
            scroll={false}
            className={`border-b-2 px-1 py-4 text-base font-medium ${
              segment === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Reviews
          </Link>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
