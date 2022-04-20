import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { put } from "utils/makeRequest";

import { ApiResponse, UserRo } from "interfaces";

import useErrorStore from "stores/error";
// import { navigate } from "@reach/router";
// import configs from "config";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useMakeAdmin(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const makeAdmin = useCallback(
    async (id: string) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<UserRo>, {}>(`/admins/users/${id}/admin`, {})
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isLoading: false, isSuccess: true });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "user/makeAdmin", payload: { id } },
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
    makeAdmin,
    ...state,
  };
}
