import { ApiResponse, GetBroadcasts } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseBroadcastsFilter {
  tag?: string;
}

export default function useBroadcasts(filter: IUseBroadcastsFilter) {
  const queries = toQueryString(filter);
  const key = `notifications/broadcasts?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetBroadcasts>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
