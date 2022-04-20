import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { put } from "utils/makeRequest";

import { ApiResponse, UserRo, UpdateProfileDto } from "interfaces";

import useErrorStore from "stores/error";
// import { navigate } from "@reach/router";
// import configs from "config";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useUpdateProfile(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const update = useCallback(
    async (data: UpdateProfileDto) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<UserRo>, UpdateProfileDto>("/profiles", data)
        ).data as UserRo;

        keys?.forEach(async (key) => await mutate(key));
        mutate(`/profiles`);
        set({ isSuccess: true });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "profile/update", payload: data },
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
    update,
    ...state,
  };
}
