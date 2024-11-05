import { ApiResponse, PlanRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function usePlan(id: string) {
  const { data, error } = useSWR<ApiResponse<PlanRo>>(`plans/${id}`, get);


  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
