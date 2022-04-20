import { ApiResponse, PaginatedDocument, UserRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useAccounts() {
  const { data, error } = useSWR<ApiResponse<PaginatedDocument<UserRo[]>>>(
    "/accounts",
    get
  );

  return {
    data,
    isLoading: !error && !data,
    error,
  };
}
