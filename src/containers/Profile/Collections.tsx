import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { CollectionType } from "../../utils/type";
import { capitalizeFirstLetter } from "../../utils/utils";
import Back from "../../assets/icons/back.svg?react";
import MediaCard from "../MediaCard";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 3,
  1024: 4,
  768: 3,
  480: 2,
};

const Collections = () => {
  const { collections } = useAuth();
  const [showCollection, setShowCollection] = useState<CollectionType | null>(
    null
  );

  return (
    <div>
      {/* Display Images in a Collection */}
      {showCollection ? (
        <div className="h-fit">
          <button
            className="cursor-pointer flex items-center gap-1 text-sm text-gray-400"
            onClick={() => setShowCollection(null)}
          >
            <Back className="w-5 h-[18px] [&>path]:fill-gray-400" /> Back
          </button>
          <div className="pt-4">
            <h2 className="text-lg font-semibold">
              {capitalizeFirstLetter(showCollection.id)}
            </h2>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex gap-4"
              columnClassName="masonry-column"
            >
              {showCollection.images.map((item, index) => (
                <MediaCard key={`${item.id}_${index}`} imgData={item} />
              ))}
            </Masonry>
          </div>
        </div>
      ) : (
        /* Display All Collections */
        <div>
          {collections.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {collections.map((collection) => (
                <div
                  className="h-70 rounded-md relative group cursor-pointer"
                  onClick={() => setShowCollection(collection)}
                >
                  <img
                    src={collection.images?.[0].urls?.small}
                    alt={`Collection_${collection.id}`}
                    className="h-full w-full rounded-md brightness-[0.85] group-hover:brightness-[1] object-cover"
                  />
                  <p className="absolute bottom-0 p-4 text-lg text-stone-50 font-bold tracking-wide">
                    {capitalizeFirstLetter(collection.id)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Collections;
