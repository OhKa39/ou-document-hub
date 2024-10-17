import { RefreshCcw, MessageCircle } from 'lucide-react';

export default function OutsideButton() {
  return (
    <div className="fixed bottom-[1.5rem] right-2 z-[99] w-[64px] rounded-2xl bg-blue-600 shadow-lg">
      <button className="flex w-full flex-col items-center justify-center gap-1 p-4 transition-colors duration-200 hover:bg-blue-700">
        <RefreshCcw className="h-6 w-6 text-white" />
        <span className="text-xs font-medium text-white">Trợ lý</span>
      </button>
      <div className="h-px w-full gap-1 bg-blue-500"></div>
      <button className="flex w-full flex-col items-center justify-center p-4 transition-colors duration-200 hover:bg-blue-700">
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="text-xs font-medium text-white">Tin mới</span>
      </button>
    </div>
  );
}
