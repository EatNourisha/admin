import { ApiResponse, UserRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useUserDetails(id: string) {
  const { data, error } = useSWR<ApiResponse<UserRo>>(
    `/admins/users/${id}`,
    get
  );

  // console.log("PROFILE", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
