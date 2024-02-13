import { ApiResponse, GetUsersRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseAdminsFilter {
  roles?: "patient" | "doctor" | "admin" | string;
  searchPhrase?: string;
  has_lineup?: boolean;
  has_subscription?: boolean;
}

export default function useAdmins(filter: IUseAdminsFilter) {
  const queries = toQueryString(filter);
  const key = `customers/admins?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetUsersRo>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
} 