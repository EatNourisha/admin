import { ApiResponse } from "interfaces";
import {  ReferralStatsRo } from "interfaces/auth.interface";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseReferralFilter {
  customer?: string;
}

export default function useReferralStats(filter: IUseReferralFilter = {}) {
  const queries = toQueryString(filter);
  const key = `/referrals/admin/stats?${queries}`;
  const { data, error } = useSWR<ApiResponse<ReferralStatsRo>>(key, get);

  console.log("REFERRALS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
