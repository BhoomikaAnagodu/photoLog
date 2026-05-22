import type { Dispatch, SetStateAction } from "react";
import Back from "../assets/icons/back.svg?react";
import Close from "../assets/icons/close.svg?react";
import AddToCollectionIcon from "../assets/icons/plus.svg?react";
import { useAuth } from "../context/AuthContext";

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
  const { collectionsLoading } = useAuth();
  return (
    <div className="w-full mx-auto p-5 min-w-80">
      {showCreateCollectionName ? (
        // ── Create Collection view ──
        <>
          <div className="flex items-center justify-between mb-6">
            <Back
              className="w-5 h-5 cursor-pointer text-stone-500 hover:text-stone-800 transition-colors"
              onClick={() => setCreateCollectionName(false)}
            />
            <p className="font-medium text-stone-800">Create Collection</p>
            <Close
              className="w-4 h-4 cursor-pointer text-stone-500 hover:text-stone-800 transition-colors"
              onClick={toggleCollectionModal}
            />
          </div>

          <input
            type="text"
            name="collectionName"
            className="block w-full p-3 text-sm text-gray-900 border border-gray-200 outline-theme-lilac placeholder:text-stone-400 rounded-xl bg-gray-50 focus:bg-white transition-colors"
            placeholder="e.g. Nature, Architecture..."
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            autoComplete="off"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && collectionName.trim()) {
                handleAddImgToCollection(collectionName);
              }
            }}
          />
          <p className="text-xs text-stone-400 mt-2 ml-1">
            Press Enter or click Add to create
          </p>

          <button
            onClick={() => handleAddImgToCollection(collectionName)}
            disabled={!collectionName.trim()}
            className="w-full bg-theme-lilac-900 text-white px-4 py-2.5 cursor-pointer text-sm rounded-xl mt-5 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </>
      ) : (
        // ── Add to Collection view ──
        <>
          <div className="flex items-center justify-between mb-5">
            <div className="w-4" /> {/* spacer to center title */}
            <p className="font-medium text-stone-800">Add to Collection</p>
            <Close
              className="w-4 h-4 cursor-pointer text-stone-500 hover:text-stone-800 transition-colors"
              onClick={toggleCollectionModal}
            />
          </div>

          {collectionsLoading ? (
            <div className="border border-stone-100 rounded-xl overflow-hidden flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-theme-lilac border-t-transparent rounded-full animate-spin" />
            </div>
          ) : collectionsList.length === 0 ? (
            <div className="text-center py-6 text-stone-400">
              <p className="text-sm">No collections yet</p>
              <p className="text-xs mt-1">Create one below to get started</p>
            </div>
          ) : (
            <div className="border border-stone-100 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
              {collectionsList.map((collection, index) => (
                <button
                  key={`${collection + index}`}
                  className={`w-full text-left text-sm ${
                    index !== 0 ? "border-t border-stone-100" : ""
                  } hover:bg-stone-50 active:bg-stone-100 cursor-pointer py-3 px-4 transition-colors`}
                  onClick={() => handleAddImgToCollection(collection)}
                >
                  {collection}
                </button>
              ))}
            </div>
          )}

          <button
            className="cursor-pointer w-full flex items-center justify-center bg-theme-lilac-100 hover:bg-theme-lilac-200 rounded-xl py-2.5 px-4 mt-4 transition-colors"
            onClick={() => setCreateCollectionName(true)}
          >
            <AddToCollectionIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Create Collection</span>
          </button>
        </>
      )}
    </div>
  );
};

export default AddToCollection;
