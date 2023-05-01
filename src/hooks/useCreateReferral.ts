import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { destroy, post, put } from "utils/makeRequest";

import { ApiResponse } from "interfaces";

import useErrorStore from "stores/error";
// import { navigate } from "@reach/router";
// import configs from "config";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useCreateReferral(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const createReferral = useCallback(
    async (dto: { email: string; name: string }) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await post<ApiResponse<any>, {}>(`/admins/referrals/`, { ...dto })
        ).data as any;

        keys?.forEach(async (key) => await mutate(key));
        set({ isLoading: false, isSuccess: true });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "referral/create", payload: { ...dto } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const updateReferral = useCallback(
    async (id: string, dto: { name: string }) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<any>, {}>(`/admins/referrals/${id}`, { ...dto })
        ).data as any;

        keys?.forEach(async (key) => await mutate(key));
        set({ isLoading: false, isSuccess: true });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "referral/update", payload: { ...dto, id } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const deleteReferral = useCallback(
    async (id: string) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await destroy<ApiResponse<any>, {}>(`/admins/referrals/${id}`)
        ).data as any;

        keys?.forEach(async (key) => await mutate(key));
        set({ isLoading: false, isSuccess: true });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "referral/delete", payload: { id } },
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
    createReferral,
    updateReferral,
    deleteReferral,
    ...state,
  };
}
