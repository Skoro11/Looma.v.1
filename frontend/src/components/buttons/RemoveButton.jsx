export function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
      </svg>
    </button>
  );
}
