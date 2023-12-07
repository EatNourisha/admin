import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { destroy, post, put } from "utils/makeRequest";

import {
  ApiResponse,
  AddNewPlanDto,
  PlanRo,
  CreatePromoDto,
  PromoRo,
} from "interfaces";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function usePromoMutations(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const createPromo = useCallback(
    async (data: CreatePromoDto) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await post<ApiResponse<PromoRo>, typeof data>(
            "/discounts/promos",
            data
          )
        ).data as PromoRo;

        keys?.forEach(async (key) => await mutate(key));
        // mutate(`/plans`);
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "promo/create", payload: data },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const deletePlan = useCallback(
    async (id: string) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (await destroy<ApiResponse<PlanRo>, void>(`/plans/${id}`))
          .data as PlanRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "plans/delete", payload: { id } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const updatePlan = useCallback(
    async (id: string, data: Partial<AddNewPlanDto>) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<PlanRo>, Partial<AddNewPlanDto>>(
            `/plans/${id}`,
            data
          )
        ).data as PlanRo;

        keys?.forEach(async (key) => await mutate(key));
        mutate(`/plans`);
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "plans/update", payload: { id, ...data } },
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
    updatePlan,
    createPromo,
    deletePlan,
    ...state,
  };
}
