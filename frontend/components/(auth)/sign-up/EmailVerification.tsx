'use client';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/components/providers/UserProvider';
import { useToast } from '@/hooks/use-toast';

export default function EmailVerification() {
  const { toast } = useToast();

  const { user } = useUserStore((state) => state);
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (time > 0) {
      const interval = setTimeout(() => setTime((prev) => prev - 1), 1000);

      if (time === 0)
        return () => {
          clearInterval(interval);
        };
    }
  }, [time]);

  const handleSubmit = async () => {
    if (user) {
      const dataFetch = await fetch(`/api/v1/auth/renew-register-token?id=${user.userId}`).then((data) => data.json());
      switch (dataFetch.statusCode) {
        case 200:
          setTime(59);
          break;
        default:
          toast({
            variant: 'destructive',
            title: 'Thông báo lỗi',
            description: 'Đã có lỗi xảy ra',
          });
          break;
      }
    }
  };

  return (
    <div className="flex flex-col items-center bg-white">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-4 text-center">
          <h2 className="mb-2 text-2xl font-bold">Đăng ký thành công!</h2>
          <p className="text-muted-foreground">Hãy kiểm tra email {user?.email} để xác nhận tài khoản.</p>
        </div>
        <div className="mb-4 flex justify-center">
          <MailIcon className="h-16 w-16 text-primary" />
        </div>
        <div className="text-center">
          <p className="mb-2 text-muted-foreground">Chưa nhận được mail? Nhấn nút để nhận mail xác nhận:</p>
          <div className="mb-4 text-2xl font-bold text-primary">00:{time.toString().padStart(2, '0')}</div>
          <Button disabled={time !== 0} onClick={() => handleSubmit()}>
            Resend Email
          </Button>
        </div>
      </div>
    </div>
  );
}

function MailIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
