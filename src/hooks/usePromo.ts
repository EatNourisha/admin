import { ApiResponse, PromoRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function usePromo(id: string) {
  const key = `discounts/promos/${id}`;
  const { data, error } = useSWR<ApiResponse<PromoRo>>(key, get);

  // console.log("PROFILE", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
