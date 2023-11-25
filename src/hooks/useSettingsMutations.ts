import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { put } from "utils/makeRequest";

import { ApiResponse, SettingsRo } from "interfaces";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useSettingsMutations(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const updateSettings = useCallback(
    async (
      data: Partial<Omit<SettingsRo, "_id" | "createdAt" | "updatedAt">>
    ) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<SettingsRo>, typeof data>(`settings`, data)
        ).data as SettingsRo;

        keys?.forEach(async (key) => await mutate(key));
        mutate(`/settings`);
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "settings/update", payload: { ...data } },
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
    updateSettings,
    ...state,
  };
}
