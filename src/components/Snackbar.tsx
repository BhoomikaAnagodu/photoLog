import type { SnackBarType } from "../utils/type";
import Close from "../assets/icons/close.svg?react";
import { useEffect } from "react";

const getStyleByType = (type: SnackBarType["type"]) => {
  switch (type) {
    case "success":
      return "text-green-700 bg-green-100 [&>svg>path]:fill-green-700";
    case "error":
      return "text-red-700 bg-red-100 [&>svg>path]:fill-red-700";
    case "info":
      return "text-blue-700 bg-blue-100 [&>svg>path]:fill-blue-700";
    case "warning":
      return "text-orange-400 bg-orange-100 [&>svg>path]:fill-orange-400";
    default:
      return "text-gray-700 bg-gray-100 [&>svg>path]:fill-gray-700";
  }
};

interface Props extends SnackBarType {
  onClose?: () => void;
}

const SnackBar = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
  autoDismiss = true,
}: Props) => {
  useEffect(() => {
    if (!autoDismiss) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, autoDismiss]);

  return (
    <>
      <div
        className={`px-4 py-3 my-2 flex items-center justify-between ${getStyleByType(
          type
        )} rounded-md`}
        role="alert"
      >
        <p className="text-sm">{message}</p>
        <Close className="w-4 h-4 ml-5 cursor-pointer" onClick={onClose} />
      </div>
    </>
  );
};

export default SnackBar;
