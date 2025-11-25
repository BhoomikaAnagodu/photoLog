import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useAuth } from "../../context/AuthContext";
import MediaCard from "../MediaCard";

const LikedImages = () => {
  const { likedImages } = useAuth();

  return (
    <div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4, 900: 5 }}
      >
        <Masonry gutter="20px">
          {likedImages.map((item, index) => (
            <MediaCard key={`${item.id}_${index}`} imgData={item} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default LikedImages;
