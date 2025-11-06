import Like from "../assets/icons/like.svg?react";
import AddToCollection from "../assets/icons/plus.svg?react";
import Back from "../assets/icons/back.svg?react";
import Close from "../assets/icons/close.svg?react";

import Modal from "../components/Modal";

import { useAuthCheckAction } from "../hooks/useAuthCheckAction";
import useMediaCardAction from "../hooks/useMediaCardAction";
import type { ImageType } from "../utils/type";

interface MediaCardProps {
  imgData: ImageType;
}

const MediaCard = (props: MediaCardProps) => {
  const { urls, alt_description } = props.imgData;
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
          {!isAddedToCollection && (
            <div
              onClick={toggleCollectionModal}
              className="bg-gray-200 px-2 py-1 rounded-sm hover:[&>svg]:fill-gray-950 hover:bg-gray-50"
            >
              <AddToCollection className="w-4 h-4 fill-gray-500" />
            </div>
          )}
        </div>
      </div>
      {Login}
      {openCollectionModal && (
        <Modal onClose={toggleCollectionModal} showCloseIcon={false}>
          <div className="w-full mx-auto text-center p-3">
            {showCreateCollectionName ? (
              <>
                <div className="flex items-center justify-between">
                  <Back
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => setCreateCollectionName(false)}
                  />
                  <p>Create Collection</p>
                  <Close
                    className="w-4 h-4 cursor-pointer"
                    onClick={toggleCollectionModal}
                  />
                </div>
                <div className="mt-10 mx-5">
                  <textarea
                    name="collectionName"
                    className="block w-full h-15 p-2 text-sm text-gray-900 border focus:shadow-outline outline-theme-lilac input-search-icon placeholder:text-stone-400 border-gray-300 rounded-lg bg-gray-50 focus:bg-white"
                    placeholder="Collection Name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    autoComplete="off"
                  />
                  <button
                    onClick={() => handleAddImgToCollection(collectionName)}
                    className="bg-theme-lilac-100 px-4 py-1 cursor-pointer text-sm rounded-md my-5"
                  >
                    Add
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p></p>
                  <p>Add to Collection</p>
                  <Close
                    className="w-4 h-4 cursor-pointer"
                    onClick={toggleCollectionModal}
                  />
                </div>
                <div className="mt-6 mx-5">
                  <div className="shadow-sm overflow-scroll max-h-50">
                    {collectionsList.length > 0 &&
                      collectionsList.map((collection, index) => (
                        <p
                          key={`${collection + index}`}
                          className={`w-full text-left ${
                            index === 0 ? "" : "border-t-1 border-t-stone-100"
                          } hover:bg-stone-100 cursor-pointer py-2 px-4`}
                          onClick={() => handleAddImgToCollection(collection)}
                        >
                          {collection}
                        </p>
                      ))}
                  </div>
                  <button className="cursor-pointer flex items-center justify-center mx-auto bg-theme-lilac-100 rounded-md py-2 px-4 mt-5">
                    <AddToCollection className="w-4 h-4 mr-2" />
                    <p onClick={() => setCreateCollectionName(true)}>
                      Create Collection
                    </p>
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MediaCard;
