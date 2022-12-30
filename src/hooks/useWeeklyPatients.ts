import { format, sub } from "date-fns";
import { ApiResponse, DashboardRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils";

export default function useWeeklyPatients() {
  const today = format(new Date(), "yyyy-MM-dd");
  const past7days = format(sub(new Date(), { days: 7 }), "yyyy-MM-dd");

  const { data, error } = useSWR<ApiResponse<DashboardRo>>(
    `/admins/dashboard?startDate=${past7days}&endDate=${today}&mapKey=dayOfWeek`,
    get
  );

  // console.log("PROFILE", data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
