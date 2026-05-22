import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addImageToCollection,
  isImageLiked,
  likeImage,
  disLikeImage,
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
  const queryClient = useQueryClient();

  const [openCollectionModal, setOpenCollectionModal] =
    useState<boolean>(false);
  const [showCreateCollectionName, setCreateCollectionName] =
    useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>("");

  // ── Derived state
  const collectionsList = collections.map((c) => c.id);
  const isAddedToCollection = collections.some((c) =>
    c.images.some((img) => img.id === id),
  );

  // ── isImageLiked — useQuery
  const { data: isLiked = false } = useQuery({
    queryKey: ["isLiked", user?.uid, id],
    queryFn: () => isImageLiked(user!.uid, id),
    enabled: !!user, // only runs when user is logged in
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });

  // ── likeImage — useMutation with optimistic update
  const likeMutation = useMutation({
    mutationFn: () =>
      likeImage(user!.uid, id, { ...rest, likedAt: new Date() }),
    onMutate: async () => {
      // optimistic update — show liked immediately
      await queryClient.cancelQueries({ queryKey: ["isLiked", user?.uid, id] });
      queryClient.setQueryData(["isLiked", user?.uid, id], true);
    },
    onError: (err: Error, _, previousValue) => {
      // rollback on error
      queryClient.setQueryData(["isLiked", user?.uid, id], previousValue);
      setSnackbar({
        type: "error",
        message: err?.message || "Failed to like an image",
      });
    },
    onSuccess: () => {
      setSnackbar({ type: "success", message: "Liked an Image!" });
    },
  });

  // ── disLikeImage — useMutation with optimistic update ──
  const disLikeMutation = useMutation({
    mutationFn: () => disLikeImage(user!.uid, id),
    onMutate: async () => {
      // optimistic update — show disliked immediately
      await queryClient.cancelQueries({ queryKey: ["isLiked", user?.uid, id] });
      queryClient.setQueryData(["isLiked", user?.uid, id], false);
    },
    onError: (err: Error, _, previousValue) => {
      // rollback on error
      queryClient.setQueryData(["isLiked", user?.uid, id], previousValue);
      setSnackbar({
        type: "error",
        message: err?.message || "Failed to dislike an image",
      });
    },
    onSuccess: () => {
      setSnackbar({ type: "success", message: "Disliked an Image!" });
    },
  });

  // ── addImageToCollection — useMutation ──
  const addToCollectionMutation = useMutation({
    mutationFn: (colName: string) =>
      addImageToCollection(user!.uid, colName, id, { ...rest }),
    onSuccess: () => {
      setSnackbar({ type: "success", message: "Image Saved in Collection!" });
      toggleCollectionModal();
      handleGetUserCollections(); // refresh collections in AuthContext
    },
    onError: (err: Error) => {
      setSnackbar({
        type: "error",
        message: err?.message || "Failed to add image to collection",
      });
    },
  });

  // ── handlers ──
  const handleLike = () => {
    runWithAuth(async () => {
      setLoading(true);
      try {
        await likeMutation.mutateAsync();
      } finally {
        setLoading(false);
      }
    });
  };

  const handleDisLike = () => {
    runWithAuth(async () => {
      setLoading(true);
      try {
        await disLikeMutation.mutateAsync();
      } finally {
        setLoading(false);
      }
    });
  };

  const handleAddImgToCollection = (colName: string) => {
    runWithAuth(async () => {
      setLoading(true);
      try {
        await addToCollectionMutation.mutateAsync(colName);
      } finally {
        setLoading(false);
      }
    });
  };

  const toggleCollectionModal = () => {
    setOpenCollectionModal((prev) => !prev);
    setCreateCollectionName(false);
    setCollectionName("");
  };

  const openCollectionModal_withAuth = () => {
    runWithAuth(async () => {
      setOpenCollectionModal(true);
    });
  };

  return {
    handleLike,
    handleDisLike,
    isLiked,
    isAddedToCollection,
    openCollectionModal,
    toggleCollectionModal,
    openCollectionModal_withAuth,
    handleAddImgToCollection,
    showCreateCollectionName,
    setCreateCollectionName,
    collectionsList,
    collectionName,
    setCollectionName,
  };
};

export default useMediaCardAction;
