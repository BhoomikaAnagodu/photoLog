import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { SnackBarType } from "../utils/type";
import SnackBar from "../components/Snackbar";

const initialState: {
  snackbar: SnackBarType | null;
  setSnackbar: Dispatch<SetStateAction<SnackBarType | null>>;
} = {
  snackbar: null,
  setSnackbar: () => null,
};

const SnackBarContext = createContext(initialState);

export const SnackBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [snackbar, setSnackbar] = useState<SnackBarType | null>(null);

  return (
    <SnackBarContext.Provider
      value={{ snackbar: snackbar, setSnackbar: setSnackbar }}
    >
      {children}

      {snackbar?.message && (
        <div className="fixed bottom-10 left-[50%] transform translate-x-[-50%] z-[1100]">
          <SnackBar {...snackbar} onClose={() => setSnackbar(null)} />
        </div>
      )}
    </SnackBarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => useContext(SnackBarContext);
