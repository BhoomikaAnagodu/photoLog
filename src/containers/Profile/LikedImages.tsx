import Masonry from "react-masonry-css";
import { useAuth } from "../../context/AuthContext";
import MediaCard from "../MediaCard";

const breakpointColumnsObj = {
  default: 3,
  1024: 4,
  768: 3,
  480: 2,
};

const LikedImages = () => {
  const { likedImages } = useAuth();

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="masonry-column"
      >
        {likedImages.map((item, index) => (
          <MediaCard key={`${item.id}_${index}`} imgData={item} />
        ))}
      </Masonry>
    </div>
  );
};

export default LikedImages;
