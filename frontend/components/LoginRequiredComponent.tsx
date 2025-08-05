// components/LoginRequiredDialog.tsx
'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUserStore } from './providers/UserProvider';

export function LoginRequiredDialog() {
  const { showLoginDialog, setShowLoginDialog } = useUserStore((state) => state);
  const router = useRouter();

  const handleLoginRedirect = async () => {
    setShowLoginDialog(false);
    router.push('/sign-in');
  };

  return (
    <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
          <DialogDescription>Bạn cần đăng nhập để thực hiện hành động này (thích hoặc bình luận).</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLoginRedirect}>Đăng nhập</Button>
          <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
