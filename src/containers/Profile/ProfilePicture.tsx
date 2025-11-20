import {
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { User } from "firebase/auth";

type Props = {
  croppedImage: string | null;
  setImageSrc: Dispatch<SetStateAction<string | null>>;
  user: User | null;
  setCrop: Dispatch<SetStateAction<{ x: number; y: number }>>;
  setZoom: Dispatch<SetStateAction<number>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const ProfilePicture = ({
  croppedImage,
  setImageSrc,
  user,
  setZoom,
  setCrop,
  setOpenModal,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageSrc(reader.result);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setOpenModal(true);
      }
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="w-48 h-48 relative mx-auto rounded-full overflow-hidden shadow group">
        {croppedImage || (user && user?.photoURL) ? (
          <img
            src={croppedImage || (user && user?.photoURL)!}
            className="relative w-full h-full rounded-full object-cover"
            alt="profile picture"
          />
        ) : (
          <div className="w-50 h-50 bg-gray-200 rounded-full" />
        )}
        <label
          className={`bg-gray-950/35 ${
            croppedImage || (user && user?.photoURL)
              ? "text-white"
              : "text-base"
          } rounded-b-full w-50 h-15 absolute bottom-0 hidden justify-center items-center group-hover:flex cursor-pointer`}
        >
          Upload Photo
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default ProfilePicture;
