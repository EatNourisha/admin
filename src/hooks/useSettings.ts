import { ApiResponse, SettingsRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useSettings() {
  const key = `settings`;
  const { data, error } = useSWR<ApiResponse<SettingsRo>>(key, get);

  // console.log("PROFILE", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
