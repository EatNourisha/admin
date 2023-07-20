import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { post } from "utils/makeRequest";

import { ApiResponse, AddNewBroadcastDto, BroadcastRo } from "interfaces";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useBroadcastMutations(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const addNewBroadcast = useCallback(
    async (data: AddNewBroadcastDto) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await post<ApiResponse<BroadcastRo>, AddNewBroadcastDto>("/notifications/broadcasts", data)
        ).data as BroadcastRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "plans/add", payload: data },
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
    addNewBroadcast,
    ...state,
  };
}
