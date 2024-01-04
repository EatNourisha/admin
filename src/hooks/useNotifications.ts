import { ApiResponse, GetNotifications } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseNotificationsFilter {
  page?: number;
  limit?: number;
  status?: string;
}

export default function useNotifications(filter?: IUseNotificationsFilter) {
  const queries = toQueryString(filter ?? {});
  const key = `notifications/admins?${queries}`;
  const { data, error, isLoading } = useSWR<ApiResponse<GetNotifications>>(
    key,
    get
  );

  return {
    key,
    data: data?.data,
    isLoading: isLoading,
    error,
  };
}
