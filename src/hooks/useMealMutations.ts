import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { destroy, post, put } from "utils/makeRequest";

import { ApiResponse, PlanRo, AddNewMealDto, MealRo } from "interfaces";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function useMealMutations(keys?: string[]) {
  const { mutate } = useSWRConfig();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { actions } = useErrorStore();

  const addNewMeal = useCallback(
    async (data: AddNewMealDto) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await post<ApiResponse<MealRo>, AddNewMealDto>("/meals/pack", data)
        ).data as MealRo;

        keys?.forEach(async (key) => await mutate(key));
        mutate(`/meals/pack`);
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "meals/add", payload: data },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const deleteMeal = useCallback(
    async (id: string) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await destroy<ApiResponse<PlanRo>, void>(`/meals/pack/${id}`)
        ).data as PlanRo;

        keys?.forEach(async (key) => await mutate(key));
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "meals/delete", payload: { id } },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      set({ isLoading: false });
    },
    [set, actions, keys, mutate]
  );

  const updateMeal = useCallback(
    async (id: string, data: Partial<AddNewMealDto>) => {
      set({ isLoading: true, isSuccess: false });
      try {
        const res = (
          await put<ApiResponse<MealRo>, Partial<AddNewMealDto>>(
            `/meals/pack/${id}`,
            data
          )
        ).data as MealRo;

        keys?.forEach(async (key) => await mutate(key));
        mutate(`/meals`);
        set({ isSuccess: true, isLoading: false });

        return res;
      } catch (error: any) {
        set({ isError: true });
        actions?.setError({
          action: { type: "meals/update", payload: { id, ...data } },
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
    updateMeal,
    addNewMeal,
    deleteMeal,
    ...state,
  };
}
