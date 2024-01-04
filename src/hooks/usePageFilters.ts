import { navigate, useLocation } from "@reach/router";
import usePartialState from "./usePartialState";
import debounce from "lodash/debounce";
import { useMemo } from "react";
// import { useCallback, useEffect } from "react";

interface IFilterState {
  searchQuery: string;
  searchPhrase: string;
  filterBy: string;
  nextPage?: string;
  prevPage?: string;

  limit: number;
  page: number;

  status?: string;
  [key: string]: any;
}

export default function usePageFilters<T extends IFilterState>(
  initialState: Partial<T>,
  set_url_param = true
) {
  const { search, pathname } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  // initialState = {
  //   ...initialState,
  //   page: params.get("page") ?? initialState?.page,
  //   limit: params.get("limit") ?? initialState?.limit,
  // };

  const [state, set] = usePartialState<T | IFilterState>(initialState);
  const [filter, setFilter] = usePartialState<T | IFilterState>(initialState);

  console.log("FILTERS", filter);

  const handleFilter = (key: keyof T, _value: any) => {
    set({ [key]: _value } as any);

    const delayFunc = debounce((value) => {
      setFilter({ [key]: value } as any);
      if (!!set_url_param) {
        params.set(key as any, value);
        navigate(`?${params.toString()}`);
      }
    }, 800);
    delayFunc(_value);
  };

  const onPageChange = (page: number) => {
    set({ page });
    if (!!set_url_param) {
      params.set("page", String(page));
      console.log("Page change", params.toString());
      navigate(`${pathname}?${params.toString()}`);
    }
  };

  const onNextPage = (page: string) => {
    setFilter({ nextPage: String(page), prevPage: undefined });
  };
  const onPrevPage = (page: string) => {
    setFilter({ prevPage: String(page), nextPage: undefined });
  };

  return {
    state,
    filter,
    setFilter: handleFilter,
    onNextPage,
    onPrevPage,
    onPageChange,
  };
}
