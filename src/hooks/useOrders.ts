import { ApiResponse, GetOrders } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseOrdersFilter {
  searchPhrase?: string;
  limit?: number;
  page?: number;
  customer?: string;
}

export default function useOrders(filter: IUseOrdersFilter) {
  const queries = toQueryString(filter);
  const key = `orders?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetOrders>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
