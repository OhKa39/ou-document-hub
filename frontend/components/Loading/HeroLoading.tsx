const HeroLoading = () => {
  return (
    <div className="relative flex min-h-[550px] max-w-[1536px] items-center justify-center bg-gray-100 duration-200 sm:min-h-[650px] 2xl:mx-auto">
      <div className="container z-[99] pb-8 sm:pb-0">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* text content section */}
          <div
            data-aos-once="true"
            className="order-2 flex flex-col justify-center gap-4 pt-12 text-center sm:order-1 sm:pt-0 sm:text-left"
          >
            <div className="space-y-4">
              <div className="h-8 w-full animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200"></div>
              <button className="h-10 w-32 animate-pulse rounded-full bg-gray-200"></button>
            </div>
          </div>
          {/* Image section */}
          <div className="relative order-1 flex min-h-[450px] items-center justify-center sm:order-2 sm:ml-8 sm:min-h-[450px] md:ml-6">
            <div className="flex h-[300px] items-center justify-center overflow-hidden sm:h-[450px]">
              <div className="h-[300px] w-[300px] animate-pulse rounded-md bg-gray-200 sm:h-[450px] sm:w-[300px]"></div>
            </div>
            <div className="absolute -bottom-[40px] flex justify-center gap-4 rounded-full bg-white lg:-right-1 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col lg:py-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="inline-block h-[100px] w-[100px] animate-pulse rounded-full bg-gray-200"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLoading;
