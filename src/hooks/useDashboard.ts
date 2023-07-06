import { ApiResponse } from "interfaces";
import { DashboardRo } from "interfaces/dashboard.interface";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useDashboard() {
  const { data, error } = useSWR<ApiResponse<DashboardRo>>(
    "customers/dashboard",
    get
  );

  // console.log("PROFILE", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
