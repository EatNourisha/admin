import { ApiResponse } from "interfaces";
import {  GetReferralsRo } from "interfaces/auth.interface";
import { omit } from "lodash";
import useSWR from "swr";
import { when } from "utils";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseReferralFilter {
  subscribed?: boolean;
  page?: number;
  limit?: number;
  customer?: string;
}

export default function useReferrals(filter: IUseReferralFilter = {}) {
  const queries = toQueryString(omit(filter, ['subscribed']));
  const key = when(!filter?.subscribed, `/referrals/admin/invites?${queries}`, `/referrals/admin/subscribed_invites?${queries}`);
  const { data, error } = useSWR<ApiResponse<GetReferralsRo>>(key, get);

  console.log("REFERRALS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
