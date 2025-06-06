/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../utils/utils";
import {
  BASE_API_URL,
  RANDOM_SEARCH_QUERY,
  UNSPLASH_CLIENT_ID,
} from "../utils/constant";
import { useSnackbar } from "../context/SnackBarContext";
import { useAppContext } from "../context/AppContext";

const useHomePage = () => {
  const {
    list,
    setList,
    searchQuery,
    handleChange,
    isFetching,
    setIsFetching,
  } = useAppContext();

  const [page, setPage] = useState<number>(1);
  const [searchResultFound, setSearchResultFound] = useState<boolean>(false);
  const mountedRef = useRef(false);
  const { setSnackbar } = useSnackbar();

  const getList = async (query: string, newSearch: boolean = false) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${BASE_API_URL}search/photos?client_id=${UNSPLASH_CLIENT_ID}&page=${page}&query=${encodedQuery}&per_page=30`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setSearchResultFound(!!data?.results?.length || false);
      setList((list) => {
        return newSearch ? [...data.results] : [...list, ...data.results];
      });
    } catch (err) {
      const error = err as Error;
      setSnackbar({
        type: "error",
        message:
          error?.message || "Something went wrong while fetching images.",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleScroll = debounce(() => {
    const bottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 900;

    if (bottom) {
      setPage((prev) => prev + 1);
    }
  }, 100);

  useEffect(() => {
    if (page > 1 && searchResultFound) {
      getList(searchQuery || RANDOM_SEARCH_QUERY);
    }
  }, [page, searchResultFound]);

  useEffect(() => {
    if (!mountedRef.current) {
      getList(RANDOM_SEARCH_QUERY);
      mountedRef.current = true;
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const debounceOnChange = useCallback(debounce(getList, 800), []);

  useEffect(() => {
    setIsFetching(true);
    setPage(1);
    debounceOnChange(searchQuery || "random", true);
  }, [searchQuery]);

  return {
    list,
    searchQuery,
    isFetching,
    handleChange,
  };
};

export default useHomePage;
