import Link from 'next/link';
import ThirdAppsButton from '@/components/(auth)/ThirdAppsButton';
import SignInForm from '@/components/Forms/SignInForm';

const SignIn = () => {
  return (
    <div className="grid h-fit grid-rows-1 lg:grid-cols-2 lg:grid-rows-none">
      {/* image section */}
      <div>
        {/* <Image alt='SignIn thumbnail' fill src={SignInThumbnail}/> */}
        <video
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
          src="/SignInVideo.webm"
          className="h-full w-full object-cover"
          data-testid="SignInVideoSection"
        ></video>
      </div>
      {/* sign up section */}
      <div className="mx-[10%] mt-6 pb-20 lg:mx-0 lg:ml-16 lg:mt-14 lg:w-[80%]">
        <h1 className="text-3xl font-bold">Đăng Nhập</h1>
        <p className="mt-5 pb-4 text-[18px] text-[color:var(--neutral-04)]">
          Bạn chưa có tài khoản?{' '}
          <Link className="text-[color:var(--secondary-blue)]" href="/sign-up">
            Đăng ký
          </Link>
        </p>
        {/* Social Media Button */}
        <ThirdAppsButton />
        {/* Form section */}
        <div className="mt-5 w-full">
          <SignInForm />
          <p className="mt-5 text-[18px] text-[color:var(--neutral-04)]">
            Quên mật khẩu?{' '}
            <Link className="text-[color:var(--secondary-blue)]" href="#">
              Lấy lại mật khẩu
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
