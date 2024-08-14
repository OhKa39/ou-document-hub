const CustomDot = ({ onClick, active }: { onClick?: any; active?: any }) => {
  return (
    <button className={`mx-1 focus:outline-none ${active ? 'h-5 w-5' : 'h-2 w-2'}`} onClick={() => onClick()}>
      <span
        className={`block rounded-full transition-all duration-300 ${
          active ? 'relative h-full w-full border-2 border-black bg-white' : 'h-full w-full bg-gray-400'
        }`}
      >
        {active && (
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black" />
        )}
      </span>
    </button>
  );
};
export default CustomDot;
