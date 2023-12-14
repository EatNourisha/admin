import { ApiResponse, GetPromoByID } from "interfaces";
import useSWR from "swr";
import { toQueryString } from "utils";
import { get } from "utils/makeRequest";

interface IUsePromoFilters {
  limit?: number;
  page?: number;
}

export default function usePromo(id: string, filters?: IUsePromoFilters) {
  const queries = toQueryString(filters ?? {});
  const key = `discounts/promos/${id}?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetPromoByID>>(key, get);

  // console.log("PROFILE", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
