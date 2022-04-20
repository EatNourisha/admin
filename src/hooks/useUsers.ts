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
  const { data, error } = useSWR<ApiResponse<GetUsersRO>>(
    `/admins/users?${queries}`,
    get
  );

  // console.log("USERS", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
