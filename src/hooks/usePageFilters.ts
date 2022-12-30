import usePartialState from "./usePartialState";
import debounce from "lodash/debounce";
// import { useCallback, useEffect } from "react";

interface IFilterState {
  searchQuery: string;
  filterBy: string;
  nextPage?: string;
  prevPage?: string;
}

export default function usePageFilters<T extends IFilterState>(
  initialState: Partial<T>
) {
  const [state, set] = usePartialState<T | IFilterState>(initialState);
  const [filter, setFilter] = usePartialState<T | IFilterState>(initialState);

  console.log("FILTERS", filter);

  const handleFilter = (key: keyof T, _value: string) => {
    set({ [key]: _value } as any);

    const delayFunc = debounce(
      (value) => setFilter({ [key]: value } as any),
      800
    );
    delayFunc(_value);
  };

  const onNextPage = (page: string) => {
    setFilter({ nextPage: page, prevPage: undefined });
  };
  const onPrevPage = (page: string) => {
    setFilter({ nextPage: undefined, prevPage: page });
  };

  return { state, filter, setFilter: handleFilter, onNextPage, onPrevPage };
}
