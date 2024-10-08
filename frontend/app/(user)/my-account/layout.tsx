import SideBar from '@/components/(user)/(UserSetting)/SideBar';

export default function UserSettingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen max-w-[1536px] px-12 md:px-8 lg:px-32 2xl:mx-auto">
      <h1 className="my-10 text-center text-4xl font-semibold lg:my-20">Tài khoản của tôi</h1>
      <div className="lg:gap-18 flex flex-col gap-10 lg:flex-row">
        <SideBar />
        {children}
      </div>
    </main>
  );
}
