import Masonry from "react-masonry-css";
import useHomePage from "../hooks/useHomePage";

import NoResultFound_Img from "../assets/images/no_result_found.jpg";

import MediaCard from "./MediaCard";

const breakpointColumnsObj = {
  default: 5,
  1024: 4,
  768: 3,
  480: 2,
};

const HomePage = () => {
  const { list, isFetching } = useHomePage();

  return (
    <>
      <div className="my-5 pt-15">
        {isFetching && list.length === 0 && (
          <div className="columns-4 gap-4 my-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="mb-4 h-50 w-full bg-gray-100 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        )}

        {!isFetching && list.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-4"
            columnClassName="masonry-column"
          >
            {list.map((item, index) => (
              <MediaCard key={`${item.id}_${index}`} imgData={item} />
            ))}
          </Masonry>
        )}

        {!isFetching && list.length === 0 && (
          <div className="w-4/6 mx-auto text-center">
            <img
              src={NoResultFound_Img}
              alt="No results found"
              className="w-1/2 mx-auto rounded-md"
            />
            <div className="my-5">
              <h1 className="text-2xl">No Results Found</h1>
              <p className="w-1/2 text-center mx-auto text-stone-500">
                Please try again with different keywords or use more generic
                terms.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
