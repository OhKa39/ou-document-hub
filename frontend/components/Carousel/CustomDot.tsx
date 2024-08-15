const CustomDot = ({ onClick, active }: { onClick?: any; active?: any }) => {
  return (
    <li
      className={`mx-1 focus:outline-none ${active ? 'h-6 w-6 md:h-7 md:w-7' : 'h-3 w-3 md:h-4 md:w-4'}`}
      onClick={() => onClick()}
    >
      <span
        className={`block rounded-full transition-all duration-300 ${
          active ? 'relative h-full w-full border-2 border-black bg-white' : 'h-full w-full bg-gray-400'
        }`}
      >
        {active && (
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black md:h-4 md:w-4" />
        )}
      </span>
    </li>
  );
};
export default CustomDot;
