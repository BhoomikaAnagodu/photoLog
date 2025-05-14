import useHomePage from "../hooks/useHomePage";

import NoResultFound_Img from "../assets/images/no_result_found.jpg";
import Search from "../assets/icons/search.svg?react";
import Loading from "../assets/icons/loading.svg?react";
import MediaCard from "./MediaCard";

const HomePage = () => {
  const { list, category, isFetching, handleChange } = useHomePage();

  return (
    <>
      <form className="max-w-md mx-auto">
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
            className="block w-full p-4 ps-10 text-sm text-gray-900 border placeholder:text-stone-400 border-gray-300 rounded-lg bg-gray-50 focus:outline-0 focus:bg-white"
            placeholder="Search Photos, Logos..."
            value={category}
            onChange={handleChange}
          />
        </div>
      </form>
      <div className="my-5">
        {!isFetching && (
          <>
            {list.length ? (
              <div className="columns-4 gap-4">
                {list.map((item, index) => (
                  <MediaCard key={`${item.id}_${index}`} imgData={item} />
                ))}
              </div>
            ) : (
              <div className="w-4/6 mx-auto text-center">
                <img
                  src={NoResultFound_Img}
                  alt="No results found image"
                  className="w-1/2 mx-auto rounded-md"
                />
                <div className="my-5">
                  <h1 className="text-2xl">No Results Found</h1>
                  <p className="w-1/2 text-center mx-auto text-stone-500">
                    Please try again with another keywords or maybe use gerneric
                    term
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
