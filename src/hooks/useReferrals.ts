import { ApiResponse } from "interfaces";
import { GetReferralsRO } from "interfaces/auth.interface";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseReferralFilter {
  searchQuery?: string;
}

export default function useReferrals(filter: IUseReferralFilter = {}) {
  const queries = toQueryString(filter);
  const key = `/admins/referrals?${queries}`;
  const { data, error } = useSWR<ApiResponse<GetReferralsRO>>(key, get);

  console.log("REFERRALS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
