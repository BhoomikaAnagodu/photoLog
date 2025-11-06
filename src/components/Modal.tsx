import { useEffect, useRef } from "react";
import Close from "../assets/icons/close.svg";

interface ModalProps {
  children: React.ReactNode;
  onClose: (() => Promise<void>) | (() => void);
  showCloseIcon: boolean;
}

const Modal = ({ children, onClose, showCloseIcon = true }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        console.log("Close Modal");

        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 grid h-screen w-screen place-items-center bg-black/30 z-130">
      <div
        ref={modalRef}
        className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
      >
        {showCloseIcon && (
          <img
            src={Close}
            className="w-4 h-4 absolute right-5 top-5 cursor-pointer"
            onClick={onClose}
            alt="Close modal"
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
