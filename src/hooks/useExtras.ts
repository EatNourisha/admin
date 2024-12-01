import { ApiResponse, GetMeals } from "interfaces";
import { IExtra } from "pages/Users/MealSelectionDrawer";
import useSWR from "swr";
import { get } from "utils/makeRequest";

interface IUseMealsFilter {
  searchPhrase?: string;
}

export default function useExtras(filter: IUseMealsFilter) {
  const key = `meals/extras`;
  const { data, error } = useSWR<ApiResponse<IExtra>>(key, get);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
