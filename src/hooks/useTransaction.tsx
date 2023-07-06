import { ApiResponse, TransactionRo } from "interfaces";
import useSWR from "swr";
import { get } from "utils/makeRequest";

export default function useTransaction(id: string) {
  const { data, error } = useSWR<ApiResponse<TransactionRo>>(
    `transactions/${id ?? "64919c98591e178df61d16c0"}`,
    get
  );

  console.log("Transction", id, data);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
