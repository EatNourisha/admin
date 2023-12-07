import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { put } from "utils/makeRequest";

import { ApiResponse, OrderRo, OrderStatus } from "interfaces";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useOrderMutations(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const updateOrder = useCallback(
    async (id: string, data: { status: OrderStatus }) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<OrderRo>, typeof data>(`/orders/${id}`, data)
        ).data as OrderRo;

        keys?.forEach(async (key) => await mutate(key));
        mutate(`/orders`);
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "orders/update", payload: { id, ...data } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const fixPaidOrders = useCallback(async () => {
    set({ isLoading: true, isSuccess: false });
    try {
      const res = (
        await put<ApiResponse<void>, null>(`/orders/ascertain`, null)
      ).data as void;

      keys?.forEach(async (key) => await mutate(key));
      mutate(`/orders`);
      set({ isSuccess: true, isLoading: false });

      return res;
    } catch (error: any) {
      set({ isError: true });
      actions?.setError({
        action: { type: "orders/fix-unpaid-orders", payload: null },
        message: error?.message,
        status: error?.statusCode,
        showUser: true,
      });
    }
    set({ isLoading: false });
  }, [set, actions, keys, mutate]);

  return {
    updateOrder,
    fixPaidOrders,
    ...state,
  };
}
