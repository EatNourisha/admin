import { ApiResponse, GetSubscriptions } from "interfaces";
import useSWR from "swr";
import { toQueryString } from "utils";
import { get } from "utils/makeRequest";

interface IUseSubscriptionsFilter {
  limit: number;
  page: number;
  searchPhrase: string;
  status: string;
  plan: string;
}

export default function useSubscriptions(
  filter: Partial<IUseSubscriptionsFilter>
) {
  const queries = toQueryString(filter);
  const key = `subscriptions?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetSubscriptions>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
