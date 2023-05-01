import { ApiResponse } from "interfaces";
import { ReferralRo } from "interfaces/auth.interface";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useReferralById(id: string) {
  const key = `/admins/referrals/${id}`;
  const { data, error } = useSWR<ApiResponse<ReferralRo>>(key, get);

  console.log("REFERRAL BY ID", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
