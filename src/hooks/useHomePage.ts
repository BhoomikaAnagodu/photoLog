/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { debounce } from "../utils/utils";
import {
  BASE_API_URL,
  RANDOM_SEARCH_QUERY,
  UNSPLASH_CLIENT_ID,
} from "../utils/constant";
import { useSnackbar } from "../context/SnackBarContext";
import { useAppContext } from "../context/AppContext";

const useHomePage = () => {
  const { list, setList, searchQuery, isFetching, setIsFetching } =
    useAppContext();

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const { setSnackbar } = useSnackbar();
  const PER_PAGE = 30;

  const getList = useCallback(
    async (
      query: string,
      newSearch: boolean = false,
      pageOverride?: number
    ) => {
      try {
        const currentPage = pageOverride ?? page;
        const encodedQuery = encodeURIComponent(query);
        const url = `${BASE_API_URL}search/photos?client_id=${UNSPLASH_CLIENT_ID}&page=${currentPage}&query=${encodedQuery}&per_page=${PER_PAGE}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        const hasMore = currentPage < data?.total_pages;
        setHasMore(hasMore);
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
    },
    [setList, setIsFetching, setSnackbar]
  );

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    await getList(searchQuery || RANDOM_SEARCH_QUERY, false, nextPage);
  }, [page, isFetching, hasMore, searchQuery, getList]);

  const debounceOnChange = useCallback(
    debounce((query: string, newSearch: boolean, pageOverride: number) => {
      getList(query, newSearch, pageOverride);
    }, 800),
    [getList]
  );

  useEffect(() => {
    setIsFetching(true);
    setPage(1);
    debounceOnChange(searchQuery || RANDOM_SEARCH_QUERY, true, 1);
  }, [searchQuery]);

  return {
    list,
    isFetching,
    hasMore,
    loadMore,
  };
};

export default useHomePage;
