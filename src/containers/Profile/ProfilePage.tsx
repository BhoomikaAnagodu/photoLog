import { useState } from "react";
import { useAuthCheckAction } from "../../hooks/useAuthCheckAction";
import Collections from "./Collections";
import { capitalizeFirstLetter } from "../../utils/utils";
import ProfilePicture from "./ProfilePicture";
import useCropImage from "../../hooks/useCropImage";
import Modal from "../../components/Modal";
import Cropper from "react-easy-crop";
import LikedImages from "./LikedImages";

const Tabs = ["collections", "likes"];

const ProfilePage = () => {
  const { runWithAuth, user } = useAuthCheckAction();
  const [activeTab, setActiveTab] = useState<string>("collections");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

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

  const TabContent = () => {
    switch (activeTab) {
      case "collections":
        return <Collections />;
        break;
      case "likes":
        return <LikedImages />;
        break;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="my-5 px-10 mx-auto relative">
        <div className="flex gap-12 relative justify-around">
          <div className="w-2/12 sticky top-20 text-center h-fit">
            {/* Profile Picture Section */}
            <ProfilePicture
              croppedImage={croppedImage}
              setImageSrc={setImageSrc}
              user={user}
              setCrop={setCrop}
              setZoom={setZoom}
              setOpenModal={setOpenModal}
            />
            {/* Profile Details Section */}
            <div className="my-2 ">
              <h2 className="text-2xl">{user?.displayName}</h2>
              <p className="text-base">{user?.email}</p>
            </div>
            <ul className="text-lg border-t pt-4 border-gray-200 my-4 mx-8">
              {Tabs.map((tabName) => (
                <li
                  className={`${
                    activeTab === tabName
                      ? "text-theme-lilac-900 font-extrabold"
                      : ""
                  } cursor-pointer tracking-wide text-start py-2 px-4 rounded-md hover:bg-theme-lilac-100 hover:text-theme-lilac-900`}
                  onClick={() => setActiveTab(tabName)}
                >
                  {capitalizeFirstLetter(tabName)}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-10/12">
            <div className="mt-4 h-fit">
              <TabContent />
            </div>
          </div>
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
                  className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={createCroppedImage}
                  className="px-4 py-2 bg-theme-lilac-100 rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfilePage;
