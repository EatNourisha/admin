import { ApiResponse, GetBillHistory } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseBillHistoryFilter {
  limit: number;
  page: number;
  searchPhrase: string;
}

export default function useBillHistory(
  id: string,
  filter: Partial<IUseBillHistoryFilter>
) {
  const queries = toQueryString(filter);
  const key = `transactions/customer/${id}?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetBillHistory>>(key, get);


  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
