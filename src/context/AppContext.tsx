import { createContext, useContext, useState } from "react";
import type { AppContextType, ImageType } from "../utils/type";

const initialState: AppContextType = {
  list: [],
  setList: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  handleChange: () => {},
  isFetching: false,
  setIsFetching: () => {},
};

const AppContext = createContext(initialState);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [list, setList] = useState<ImageType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(
    initialState.isFetching
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <AppContext.Provider
      value={{
        list,
        setList,
        searchQuery,
        setSearchQuery,
        handleChange,
        isFetching,
        setIsFetching,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
