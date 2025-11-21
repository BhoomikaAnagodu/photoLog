import { useLocation } from "react-router-dom";
import Like from "../assets/icons/like.svg?react";
import AddToCollectionIcon from "../assets/icons/plus.svg?react";
import Modal from "../components/Modal";

import { useAuthCheckAction } from "../hooks/useAuthCheckAction";
import useMediaCardAction from "../hooks/useMediaCardAction";
import type { ImageType } from "../utils/type";
import AddToCollection from "./AddToCollection";

interface MediaCardProps {
  imgData: ImageType;
}

const MediaCard = ({ imgData }: MediaCardProps) => {
  const location = useLocation();
  const { urls, alt_description } = imgData;
  const { Login, runWithAuth, user } = useAuthCheckAction();
  const {
    handleLike,
    isLiked,
    isAddedToCollection,
    openCollectionModal,
    toggleCollectionModal,
    handleAddImgToCollection,
    setCreateCollectionName,
    showCreateCollectionName,
    collectionsList,
    collectionName,
    setCollectionName,
    handleDisLike,
  } = useMediaCardAction({
    runWithAuth,
    imageData: imgData,
    user,
  });

  return (
    <div className="mb-4 relative hover:[&>div]:visible">
      <img
        src={urls?.small}
        alt={alt_description}
        className="rounded-2xl shadow w-full h-auto block"
        loading="lazy"
      />
      <div className="invisible cursor-pointer absolute p-4 top-0 w-full h-full bg-black/30 rounded-2xl">
        <div className="flex gap-2 absolute top-4 right-2">
          {location.pathname === "/" && (
            <div
              onClick={isLiked ? handleDisLike : handleLike}
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
          )}
          {!isAddedToCollection && location.pathname === "/" && (
            <div
              onClick={toggleCollectionModal}
              className="bg-gray-200 px-2 py-1 rounded-sm hover:[&>svg]:fill-gray-950 hover:bg-gray-50"
            >
              <AddToCollectionIcon className="w-4 h-4 fill-gray-500" />
            </div>
          )}
        </div>
      </div>
      {Login}
      {openCollectionModal && (
        <Modal onClose={toggleCollectionModal} showCloseIcon={false}>
          <AddToCollection
            showCreateCollectionName={showCreateCollectionName}
            setCreateCollectionName={setCreateCollectionName}
            toggleCollectionModal={toggleCollectionModal}
            collectionName={collectionName}
            setCollectionName={setCollectionName}
            handleAddImgToCollection={handleAddImgToCollection}
            collectionsList={collectionsList}
          />
        </Modal>
      )}
    </div>
  );
};

export default MediaCard;
