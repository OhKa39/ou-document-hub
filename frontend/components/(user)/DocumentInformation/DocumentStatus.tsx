import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationTagProps {
  isVerified: boolean;
  className?: string;
}

export default function DocumentStatus({ isVerified = false, className }: VerificationTagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-base font-medium',
        isVerified
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        className
      )}
    >
      {isVerified ? (
        <>
          <Check className="mr-1 h-7 w-7" />
          Đã xác nhận
        </>
      ) : (
        <>
          <X className="mr-1 h-7 w-7" />
          Chưa xác nhận
        </>
      )}
    </div>
  );
}
