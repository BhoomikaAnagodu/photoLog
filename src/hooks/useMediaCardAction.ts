import type { AuthAction } from "../utils/type";

interface MediaCardActionProps {
  runWithAuth: (action: AuthAction) => void;
}

const useMediaCardAction = ({ runWithAuth }: MediaCardActionProps) => {
  const handleLike = () => {
    runWithAuth(() => {
      console.log("Liked!");
      // TODO: Like functionality
    });
  };

  return {
    handleLike,
  };
};

export default useMediaCardAction;
