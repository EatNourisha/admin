import { ApiResponse, AppointmentRO } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useAppointment(id: string) {
  const { data, error } = useSWR<ApiResponse<AppointmentRO>>(
    `/admins/appointments/${id}`,
    get
  );

  // console.log("PROFILE", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
