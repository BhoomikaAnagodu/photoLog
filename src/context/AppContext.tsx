import { createContext, useContext, useState } from "react";
import type { AppContextType } from "../utils/type";
import { debounce } from "../utils/utils";

const initialState: AppContextType = {
  inputValue: "",
  searchQuery: "",
  handleChange: () => {},
  isFetching: false,
  setIsFetching: () => {},
};

const AppContext = createContext(initialState);

const debouncedSetSearch = debounce(
  (setter: (value: string) => void, value: string) => setter(value),
  600,
);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(
    initialState.isFetching,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedSetSearch(setSearchQuery, e.target.value);
  };

  return (
    <AppContext.Provider
      value={{
        inputValue,
        searchQuery,
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
