import { ApiResponse, GetOrderById } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useOrderDetails(id: string) {
  const key = `orders/${id}`;
  const { data, error } = useSWR<ApiResponse<GetOrderById>>(key, get);
  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    key,
  };
}
