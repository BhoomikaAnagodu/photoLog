import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import GlobalLoader from "../components/GlobalLoader";

interface LoaderContextType {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const initialState: LoaderContextType = {
  loading: false,
  setLoading: () => {},
};

const LoaderContext = createContext(initialState);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <GlobalLoader />}
    </LoaderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoader = () => useContext(LoaderContext);
