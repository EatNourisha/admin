import { ApiResponse, GetMealAnalysis } from "interfaces";
import useSWR from "swr";
import { toQueryString } from "utils";
import { get } from "utils/makeRequest";

interface IUseMealAnalysisFilter {
  limit: number;
  page: number;
  searchPhrase: string;
  day: string;
  meal_type: string;
}

export default function useMealAnalysis(
  id: string,
  filter: Partial<IUseMealAnalysisFilter>
) {
  const queries = toQueryString(filter);
  const key = `/meals/pack/analysis/${id}?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetMealAnalysis>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
