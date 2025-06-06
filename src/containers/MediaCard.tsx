import Like from "../assets/icons/like.svg?react";
import { useAuthCheckAction } from "../hooks/useAuthCheckAction";
import useMediaCardAction from "../hooks/useMediaCardAction";
import type { ImageType } from "../utils/type";

interface MediaCardProps {
  imgData: ImageType;
}

const MediaCard = (props: MediaCardProps) => {
  const { urls, alt_description } = props.imgData;
  const { Login, runWithAuth, user } = useAuthCheckAction();
  const { handleLike, isLiked } = useMediaCardAction({
    runWithAuth,
    imageData: props.imgData,
    user,
  });

  return (
    <div className="mb-4 relative hover:[&>div]:visible">
      <img
        src={urls?.small}
        alt={alt_description}
        className="rounded-2xl shadow"
        loading="lazy"
      />
      <div className="invisible cursor-pointer absolute p-4 top-0 w-full h-full bg-black/30 rounded-2xl">
        <div className="flex gap-2 absolute top-4 right-2">
          <div
            onClick={handleLike}
            className={`bg-gray-200 px-2 py-1 ${
              isLiked ? "" : "hover:[&>svg>path]:fill-gray-950"
            }  rounded-sm hover:bg-gray-50`}
          >
            <Like
              className={`w-4 h-4 ${
                isLiked ? "[&>path]:fill-red-500" : "[&>path]:fill-gray-500"
              }`}
            />
          </div>
          {/* TODO: Add to collection functionality */}
          {/* <div className="bg-gray-200 px-2 py-1 rounded-sm hover:[&>svg]:fill-gray-950 hover:bg-gray-50">
            <Like className="w-4 h-4 fill-gray-500" />
          </div> */}
        </div>
      </div>
      {Login}
    </div>
  );
};

export default MediaCard;
