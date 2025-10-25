import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { searchByQuery } from "../services/userService";
import { useChatContext } from "../context/ChatContext";

function SearchBar({ onClick }) {
  const { searchTerm, setSearchTerm, searchResult, setSearchResult } =
    useUserContext();

  const { setListState } = useChatContext();
  async function sendQuery(searchTerm) {
    try {
      console.log(searchTerm);
      if (!searchTerm || searchTerm.trim().length === 0) {
        toast.warning("Search query is empty");
        return null;
      }
      const response = await searchByQuery(searchTerm);
      console.log(response.data.users);
      setListState("search");
      if (response.data.users.length > 0) {
        setSearchResult(response.data.users);
      } else {
        toast.info("No items found");
        setSearchResult([]);
      }
    } catch (error) {
      toast.error("Problem sending query");
      console.log(error.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendQuery(searchTerm);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-body)] md:mx-4 flex p-2 border-0 rounded-2xl md:my-4"
    >
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
        type="text"
        className="border-white/20 text-white ml-2 w-full outline-none bg-transparent"
      />

      <button type="submit" aria-label="Search">
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
      </button>
    </form>
  );
}

export default SearchBar;
