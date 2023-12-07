import { ApiResponse, GetPromos } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUsePromosFilter {
  searchPhrase?: string;
  limit?: number;
  page?: number;
  customer?: string;
}

export default function usePromos(filter: IUsePromosFilter) {
  const queries = toQueryString(filter);
  const key = `discounts/promos/?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetPromos>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
