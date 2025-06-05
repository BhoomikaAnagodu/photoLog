import Search from "../assets/icons/search.svg?react";
import Loading from "../assets/icons/loading.svg?react";
import { useAppContext } from "../context/AppContext";

const SearchComponent = () => {
  const { searchQuery, handleChange, isFetching } = useAppContext();

  return (
    <form className="max-w-lg w-full mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          {isFetching ? (
            <Loading className="w-4 h-4 transform animate-spin" />
          ) : (
            <Search className="w-4 h-4 [&>path]:stroke-stone-400" />
          )}
        </div>
        <input
          type="search"
          name="searchInput"
          className="block w-full p-2 ps-10 text-sm text-gray-900 border focus:shadow-outline outline-theme-lilac input-search-icon placeholder:text-stone-400 border-gray-300 rounded-lg bg-gray-50 focus:bg-white"
          placeholder="Search Photos, Logos..."
          value={searchQuery}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
    </form>
  );
};

export default SearchComponent;
