import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { put } from "utils/makeRequest";

import { ApiResponse, NotificationRo } from "interfaces";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useNotificationMutations(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const markAsRead = useCallback(
    async (ids: string[]) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<NotificationRo>, { ids: string[] }>(
            `/notifications/admins/read`,
            { ids }
          )
        ).data as NotificationRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "notification/markAsRead", payload: { ids } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  return {
    markAsRead,
    ...state,
  };
}
