interface ModalProps {
  children: React.ReactNode;
  onClose: () => Promise<void>;
}

const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 grid h-screen w-screen place-items-center bg-black/30 z-[999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
