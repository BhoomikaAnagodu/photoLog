import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useSnackbar } from "../context/SnackBarContext";
import { useLoader } from "../context/LoaderContext";
import { uploadProfilePicture } from "../networks/user";
import type { AuthAction } from "../utils/type";

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

interface Props {
  imageSrc: string | null;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  runWithAuth: (action: AuthAction) => void;
}

const useCropImage = ({ imageSrc, setOpenModal, runWithAuth }: Props) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const { setSnackbar } = useSnackbar();
  const { setLoading } = useLoader();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create circular cropped image
  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const image = new Image();
    image.src = imageSrc;

    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    // Create a second canvas for circular mask
    const circleCanvas = document.createElement("canvas");
    const cctx = circleCanvas.getContext("2d")!;
    circleCanvas.width = canvas.width;
    circleCanvas.height = canvas.height;

    cctx.beginPath();
    cctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      0,
      Math.PI * 2
    );
    cctx.closePath();
    cctx.clip();

    cctx.drawImage(canvas, 0, 0);

    const url = circleCanvas.toDataURL("image/png");
    runWithAuth(async (user) => {
      try {
        setLoading(true);
        await uploadProfilePicture(user, url);
        setSnackbar({
          type: "success",
          message: "Profile updated successfully",
        });
      } catch (err) {
        const error = err as Error;
        setSnackbar({
          type: "error",
          message: error?.message || "Failed to upload profile picture",
        });
      } finally {
        setLoading(false);
        setCroppedImage(url);
        setOpenModal(false);
      }
    });
  };
  return {
    onCropComplete,
    createCroppedImage,
    croppedImage,
    crop,
    setCrop,
    zoom,
    setZoom,
  };
};

export default useCropImage;
