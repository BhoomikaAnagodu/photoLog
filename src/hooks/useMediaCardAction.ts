import { useEffect, useState } from "react";
import {
  addImageToCollection,
  isImageLiked,
  likeImage,
} from "../networks/user";
import type { AuthAction, ImageType } from "../utils/type";
import type { User } from "firebase/auth";
import { useSnackbar } from "../context/SnackBarContext";
import { useLoader } from "../context/LoaderContext";
import { useAuth } from "../context/AuthContext";

interface MediaCardActionProps {
  runWithAuth: (action: AuthAction) => void;
  imageData: ImageType;
  user: User | null;
}

const useMediaCardAction = ({
  runWithAuth,
  imageData,
  user,
}: MediaCardActionProps) => {
  const { id, ...rest } = imageData;
  const { collections, handleGetUserCollections } = useAuth();
  const { setSnackbar } = useSnackbar();
  const { setLoading } = useLoader();

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [openCollectionModal, setOpenCollectionModal] =
    useState<boolean>(false);
  const [isAddedToCollection, setIsAddedToCollection] =
    useState<boolean>(false);
  const [showAddCollectionName, setAddCollectionName] =
    useState<boolean>(false);
  const [collectionsList, setCollectionsList] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");

  const handleLike = () => {
    runWithAuth(async (user) => {
      try {
        setLoading(true);
        await likeImage(user.uid, id, {
          ...rest,
          likedAt: new Date(),
        });
        setIsLiked(true);
        setSnackbar({
          type: "success",
          message: "Liked Image!",
        });
      } catch (err) {
        const error = err as Error;
        setSnackbar({
          type: "error",
          message: error?.message || "Failed to like image",
        });
      } finally {
        setLoading(false);
      }
    });
  };

  const toggleCollectionModal = () => {
    runWithAuth(async () => {
      setOpenCollectionModal((prev) => !prev);
    });
  };

  const handleAddImgToCollection = (collectionName: string) => {
    runWithAuth(async (user) => {
      try {
        setLoading(true);
        await addImageToCollection(user.uid, collectionName, id, {
          ...rest,
        });
        setIsAddedToCollection(true);
        setSnackbar({
          type: "success",
          message: "Image Saved in Collection!",
        });
        toggleCollectionModal();
        handleGetUserCollections();
      } catch (err) {
        const error = err as Error;
        setSnackbar({
          type: "error",
          message: error?.message || "Failed to add image to collection",
        });
      } finally {
        setLoading(false);
      }
    });
  };

  const checkisImageLiked = async () => {
    let isLikedValue = false;
    try {
      isLikedValue = await isImageLiked(user?.uid || "", id);
      setIsLiked(isLikedValue);
    } catch (err) {
      const error = err as Error;
      setSnackbar({
        type: "error",
        message: error?.message || "Failed to data if image is liked or not",
      });
    }
  };

  useEffect(() => {
    const userCollectionList = collections.map((collection) => collection.id);
    setCollectionsList(userCollectionList);

    const checkisImageAddedToCollection = () => {
      const isImgAddedToCollection = collections.some((collection) =>
        collection.images.some((imageData) => imageData.id === id)
      );
      setIsAddedToCollection(isImgAddedToCollection);
    };

    checkisImageAddedToCollection();
  }, [collections, id]);

  useEffect(() => {
    if (user) {
      checkisImageLiked();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    handleLike,
    isLiked,
    isAddedToCollection,
    openCollectionModal,
    toggleCollectionModal,
    handleAddImgToCollection,
    showAddCollectionName,
    setAddCollectionName,
    collectionsList,
    collectionName,
    setCollectionName,
  };
};

export default useMediaCardAction;
