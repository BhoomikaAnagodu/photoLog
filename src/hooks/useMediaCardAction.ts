import { useEffect, useState } from "react";
import { isImageLiked, likeImage } from "../networks/user";
import type { AuthAction, ImageType } from "../utils/type";
import type { User } from "firebase/auth";
import { useSnackbar } from "../context/SnackBarContext";
import { useLoader } from "../context/LoaderContext";

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
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { setSnackbar } = useSnackbar();
  const { setLoading } = useLoader();

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
    console.log("user", user);
    if (user) {
      checkisImageLiked();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    handleLike,
    isLiked,
  };
};

export default useMediaCardAction;
