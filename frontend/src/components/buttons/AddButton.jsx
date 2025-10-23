export function AddButton({ onClick, color }) {
  const variants = {
    primary: "bg-[var(--color-primary)]",
    success: "bg-green-500 hover:bg-green-600",
    danger: "bg-red-500 hover:bg-red-600",
  };
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-7 h-7 flex items-center justify-center rounded-full transition-colors ${variants[color]}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
