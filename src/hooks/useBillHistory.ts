import { ApiResponse, GetBillHistory } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseBillHistoryFilter {
  limit: number;
  page: number;
  searchPhrase: string;
}

export default function useBillHistory(filter: Partial<IUseBillHistoryFilter>) {
  const queries = toQueryString(filter);
  const key = `transactions?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetBillHistory>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
