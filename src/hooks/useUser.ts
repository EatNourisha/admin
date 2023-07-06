import { ApiResponse, UserRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useUser() {
  const { data, error } = useSWR<ApiResponse<UserRo>>("customers/me", get);

  // console.log("PROFILE", data);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
}
