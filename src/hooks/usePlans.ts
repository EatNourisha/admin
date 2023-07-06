import { ApiResponse, GetPlans } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUsePlansFilter {
  searchPhrase?: string;
}

export default function usePlans(filter: IUsePlansFilter) {
  const queries = toQueryString(filter);
  const key = `plans?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetPlans>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
