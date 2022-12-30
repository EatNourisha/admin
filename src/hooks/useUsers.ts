import { ApiResponse, GetUsersRO } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseUsersFilter {
  roles?: "patient" | "doctor" | "admin" | string;
  searchQuery?: string;
}

export default function useUsers(
  filter: IUseUsersFilter = { roles: "patient,doctor,admin" }
) {
  const queries = toQueryString(filter);
  const key = `/admins/users?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetUsersRO>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
