import { ApiResponse, GetAppointmentsRO } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

import toQueryString from "utils/toQueryString";

interface IUseGetAppointmentsFilter {
  user_id?: string;
  role?: string;
  searchQuery?: string;
  limit?: number;
  page?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export default function useGetAppointments(
  filter: IUseGetAppointmentsFilter = {}
) {
  const queries = toQueryString(filter);
  const { data, error } = useSWR<ApiResponse<GetAppointmentsRO>>(
    `/admins/appointments?${queries}`,
    get
  );

  // console.log("PROFILE", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
