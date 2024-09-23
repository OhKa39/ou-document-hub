import Link from 'next/link';
import ThirdAppsButton from '@/components/(auth)/ThirdAppsButton';
import SignUpForm from '@/components/Forms/SignUpForm';

const SignUp = () => {
  return (
    <div className="grid h-fit grid-rows-1 lg:grid-cols-2 lg:grid-rows-none">
      {/* image section */}
      <div>
        {/* <Image alt='SignUp thumbnail' fill src={SignUpThumbnail}/> */}
        <video
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
          src="/SignUpVideo.webm"
          className="h-full w-full object-cover"
          data-testid="SignUpVideoSection"
        ></video>
      </div>
      {/* sign up section */}
      <div className="mx-[10%] mt-6 pb-20 lg:mx-0 lg:ml-16 lg:mt-14 lg:w-[80%]">
        <h1 className="text-3xl font-bold">Đăng ký</h1>
        <p className="mt-5 text-[18px] text-[color:var(--neutral-04)]">
          Bạn đã có tài khoản?{' '}
          <Link className="text-[color:var(--secondary-blue)]" href="/sign-in">
            Đăng nhập
          </Link>
        </p>
        {/* Social Media Button */}
        <ThirdAppsButton />
        {/* Form section */}
        <div className="mt-5 w-full">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
