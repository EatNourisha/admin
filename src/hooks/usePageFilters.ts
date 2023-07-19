import usePartialState from "./usePartialState";
import debounce from "lodash/debounce";
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
  initialState: Partial<T>
) {
  const [state, set] = usePartialState<T | IFilterState>(initialState);
  const [filter, setFilter] = usePartialState<T | IFilterState>(initialState);

  console.log("FILTERS", filter);

  const handleFilter = (key: keyof T, _value: any) => {
    set({ [key]: _value } as any);

    const delayFunc = debounce(
      (value) => setFilter({ [key]: value } as any),
      800
    );
    delayFunc(_value);
  };

  const onPageChange = (page: number) => set({ page });

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
