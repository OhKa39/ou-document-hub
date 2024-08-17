const CustomLeftArrow = ({ onClick }: { onClick?: any }) => (
  <button
    onClick={() => onClick()}
    className="absolute left-0 top-[30%] z-10 rounded-full bg-white bg-opacity-50 p-2 shadow-md transition-all hover:bg-opacity-75"
    aria-label="Move To Left"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>
);

export default CustomLeftArrow;