import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { put, destroy } from "utils/makeRequest";

import { ApiResponse, UserRo } from "interfaces";

import useErrorStore from "stores/error";
// import { navigate } from "@reach/router";
// import configs from "config";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  action: "updateStatus" | "delete" | "none";
}

type ActionType = "enable" | "disable";

export default function useUpdateAdminStatus(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const update = useCallback(
    (action: ActionType) => async (id: string) => {
      set({ isLoading: true, isSuccess: false, action: "updateStatus" });
      try {
        const res = (
          await put<ApiResponse<UserRo>, null>(
            `/admins/users/${id}/${action}`,
            null
          )
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false, action: "none" });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: `admin/${action}-${id}`, payload: null },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false, action: "none" });
    },
    [set, actions, keys, mutate]
  );

  const removeAdmin = useCallback(
    async (id: string) => {
      set({ isLoading: true, isSuccess: false, action: "delete" });
      try {
        const res = (
          await destroy<ApiResponse<UserRo>, null>(
            `/admins/users/${id}/admin`,
            null
          )
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false, action: "none" });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: `admin/delete-${id}`, payload: null },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false, action: "none" });
    },
    [set, actions, keys, mutate]
  );

  return {
    update,
    removeAdmin,
    isRemoving: state?.isLoading && state?.action === "delete",
    isUpdating: state?.isLoading && state?.action === "updateStatus",
    ...state,
  };
}
