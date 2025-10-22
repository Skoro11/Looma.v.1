function SearchBar() {
  return (
    <div className="bg-[var(--color-body)] md:mx-4 flex p-2 md:p-2 border-0 rounded-2xl  md:my-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <input
        placeholder="Search"
        type="text"
        className=" border-white/20 text-white ml-2 w-full"
      />
    </div>
  );
}

export default SearchBar;
