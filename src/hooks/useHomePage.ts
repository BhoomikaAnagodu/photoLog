import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../utils/utils";
import { BASE_API_URL, UNSPLASH_CLIENT_ID } from "../utils/constant";

const useHomePage = () => {
  const [list, setList] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [searchResultFound, setSearchResultFound] = useState<boolean>(false);
  const mountedRef = useRef(false);

  const getList = async (query: string, newSearch: boolean = false) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${BASE_API_URL}search/photos?client_id=${UNSPLASH_CLIENT_ID}&page=${page}&query=${encodedQuery}&per_page=30`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setSearchResultFound(!!data?.results?.length || false);
      newSearch
        ? setList([...data.results])
        : setList((list) => [...list, ...data.results]);
    } catch (error) {
      // TODO: Implement snackbar later
      console.error("Fetching error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleScroll = debounce(() => {
    const bottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 300;

    if (bottom) {
      setPage((prev) => prev + 1);
    }
  }, 200);

  useEffect(() => {
    if (page > 1 && searchResultFound) {
      getList(category || "random");
    }
  }, [page, searchResultFound]);

  useEffect(() => {
    if (!mountedRef.current) {
      getList("random");
      mountedRef.current = true;
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const debounceOnChange = useCallback(debounce(getList, 800), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFetching(true);
    setPage(1);
    setCategory(e.target.value);
    debounceOnChange(e.target.value || "random", true);
  };

  return {
    list,
    category,
    isFetching,
    handleChange,
  };
};

export default useHomePage;
