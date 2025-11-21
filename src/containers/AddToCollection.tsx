import type { Dispatch, SetStateAction } from "react";
import Back from "../assets/icons/back.svg?react";
import Close from "../assets/icons/close.svg?react";
import AddToCollectionIcon from "../assets/icons/plus.svg?react";

type Props = {
  showCreateCollectionName: boolean;
  setCreateCollectionName: Dispatch<SetStateAction<boolean>>;
  toggleCollectionModal: () => void;
  collectionName: string;
  setCollectionName: Dispatch<SetStateAction<string>>;
  handleAddImgToCollection: (name: string) => void;
  collectionsList: string[];
};

const AddToCollection = ({
  showCreateCollectionName,
  setCreateCollectionName,
  toggleCollectionModal,
  collectionName,
  setCollectionName,
  handleAddImgToCollection,
  collectionsList,
}: Props) => {
  return (
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
              <AddToCollectionIcon className="w-4 h-4 mr-2" />
              <p onClick={() => setCreateCollectionName(true)}>
                Create Collection
              </p>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddToCollection;
