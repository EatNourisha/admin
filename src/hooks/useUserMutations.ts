import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { post, put } from "utils/makeRequest";

import { ApiResponse, UserRo } from "interfaces";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";
import { when } from "utils";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useUserMutations(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const addNote = useCallback(
    async (id: string, data: { notes: string }) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<UserRo>, typeof data>(
            `/customers/${id}/notes`,
            data
          )
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        // mutate(`/plans`);
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "users/addNote", payload: data },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const suspendUser = useCallback(
    async (id: string, is_suspended: boolean) => {
      set({ isLoading: true, isSuccess: false });

      const action = when(is_suspended, `enable`, `disable`);

      try {
        const res = (
          await put<ApiResponse<UserRo>, any>(`/customers/${id}/${action}`, {})
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "users/suspend", payload: { id, is_suspended } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const makeAdmin = useCallback(
    async (id: string) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<UserRo>, null>(
            `/customers/${id}/make_admin`,
            null
          )
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "users/make_admin", payload: { id } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const revokeAdminPrivilege = useCallback(
    async (id: string) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<UserRo>, null>(
            `/customers/${id}/revoke_admin`,
            null
          )
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "users/revoke_admin", payload: { id } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const syncUsersToMailchimp = useCallback(async () => {
    set({ isLoading: true, isSuccess: false });
    try {
      const res = (
        await post<ApiResponse<any>, null>(`/customers/sync-contacts`, null)
      ).data as any;

      keys?.forEach(async (key) => await mutate(key));
      set({ isSuccess: true, isLoading: false });

      return res;
    } catch (error: any) {
      set({ isError: true });
      actions?.setError({
        action: { type: "users/sync-contacts", payload: null },
        message: error?.message,
        status: error?.statusCode,
        showUser: true,
      });
    }
    set({ isLoading: false });
  }, [set, actions, keys, mutate]);

  return {
    makeAdmin,
    addNote,
    suspendUser,
    revokeAdminPrivilege,
    syncUsersToMailchimp,
    ...state,
  };
}
