import { ApiResponse, LineupRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useLineup(id: string) {
  const key = `lineups/${id}?silent=true`;
  const { data, error } = useSWR<ApiResponse<LineupRo>>(key, get);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
