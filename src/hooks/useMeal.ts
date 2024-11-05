import { ApiResponse, MealRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useMeal(id: string) {
  const { data, error } = useSWR<ApiResponse<MealRo>>(`meals/pack/${id}`, get);


  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
