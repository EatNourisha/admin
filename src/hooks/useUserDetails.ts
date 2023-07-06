import { ApiResponse, UserRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useUserDetails(id: string) {
  const key = `customers/${id}`;
  const { data, error } = useSWR<ApiResponse<UserRo>>(key, get);

  // console.log("PROFILE", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    key,
  };
}
