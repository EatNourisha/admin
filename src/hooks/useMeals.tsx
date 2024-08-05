import { ApiResponse, GetMeals } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseMealsFilter {
  searchPhrase?: string;
}

export default function useMeals(filter: IUseMealsFilter) {
  const queries = toQueryString(filter);
  const key = `meals/pack`;
  // const key = `meals/pack?${queries}`;

  const { data, error } = useSWR<ApiResponse<GetMeals>>(key, get);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
