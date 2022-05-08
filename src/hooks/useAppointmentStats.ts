import { ApiResponse, AppointmentStatsRO } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

import toQueryString from "utils/toQueryString";

interface IUseAppointmentStatsFilter {
  status?: string;
}

export default function useGetAppointmentStats(
  filter: IUseAppointmentStatsFilter = {}
) {
  const queries = toQueryString(filter);
  const { data, error } = useSWR<ApiResponse<AppointmentStatsRO>>(
    `/admins/appointments/stats?${queries}`,
    get
  );

  console.log("STATS", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
