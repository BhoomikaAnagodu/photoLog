import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  BASE_API_URL,
  RANDOM_SEARCH_QUERY,
  UNSPLASH_CLIENT_ID,
} from "../utils/constant";
import { useSnackbar } from "../context/SnackBarContext";
import { useAppContext } from "../context/AppContext";
import type { ImageType } from "../utils/type";

const PER_PAGE = 30;

const fetchPhotos = async (
  query: string,
  page: number,
): Promise<{
  results: ImageType[];
  total_pages: number;
}> => {
  const encoded = encodeURIComponent(query);
  const url = `${BASE_API_URL}search/photos?client_id=${UNSPLASH_CLIENT_ID}&page=${page}&query=${encoded}&per_page=${PER_PAGE}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

const useHomePage = () => {
  const { searchQuery, setIsFetching } = useAppContext();
  const { setSnackbar } = useSnackbar();
  const query = searchQuery || RANDOM_SEARCH_QUERY;

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["photos", query],
      queryFn: ({ pageParam = 1 }) => fetchPhotos(query, pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        allPages.length < lastPage.total_pages
          ? allPages.length + 1
          : undefined,
      staleTime: 1000 * 60 * 5,
      throwOnError: (error) => {
        setSnackbar({
          type: "error",
          message: error.message || "Something went wrong.",
        });
        return false;
      },
    });

  // To sync TanStack's isFetching → AppContext so Header can read it
  useEffect(() => {
    setIsFetching(isFetching && !isFetchingNextPage);
  }, [isFetching, setIsFetching, isFetchingNextPage]);

  // flatten all pages into a single list
  const list = data?.pages.flatMap((page) => page.results) ?? [];

  return {
    list,
    isFetching,
    isFetchingNextPage,
    hasMore: !!hasNextPage,
    loadMore: fetchNextPage,
  };
};

export default useHomePage;
