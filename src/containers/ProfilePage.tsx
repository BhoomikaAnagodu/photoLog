import { useRef, useState, type ChangeEvent } from "react";
import Modal from "../components/Modal";
import Cropper from "react-easy-crop";
import useCropImage from "../hooks/useCropImage";
import { useAuthCheckAction } from "../hooks/useAuthCheckAction";

const ProfilePage = () => {
  const { runWithAuth, user } = useAuthCheckAction();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

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

  const {
    onCropComplete,
    createCroppedImage,
    croppedImage,
    crop,
    setCrop,
    zoom,
    setZoom,
  } = useCropImage({
    imageSrc,
    setOpenModal,
    runWithAuth,
  });

  return (
    <div className="my-10 pt-20">
      <div className="p-10 mx-30 relative">
        <div className="flex gap-20 items-center">
          {/* Profile Picture Section */}
          <div className="w-50 h-50 relative rounded-full overflow-hidden shadow group">
            {croppedImage || (user && user?.photoURL) ? (
              <img
                src={croppedImage || (user && user?.photoURL)!}
                className="relative w-full h-full rounded-full object-cover"
                alt="profile"
              />
            ) : (
              <div className="w-50 h-50 bg-gray-200 rounded-full" />
            )}

            <label
              className={`bg-gray-950/35 ${
                croppedImage ? "text-white" : "text-base"
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
          <div>
            <h2 className="text-3xl">{user?.displayName}</h2>
            <p className="text-lg">{user?.email}</p>
          </div>
        </div>
        {openModal && (
          <Modal onClose={() => setOpenModal(false)} showCloseIcon={false}>
            <div>
              <div className="relative w-full h-64 bg-black">
                <Cropper
                  image={imageSrc!}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  restrictPosition={false}
                />
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3 mt-3">
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.05}
                  value={zoom}
                  className="cursor-pointer"
                  onChange={(e) => setZoom(Number(e.target.value))}
                />

                <div className="flex justify-between">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={createCroppedImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
