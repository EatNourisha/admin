import { useDisclosure, useToast } from "@chakra-ui/react";
import usePartialState from "hooks/usePartialState";
import usePromoMutations from "hooks/usePromoMutation";
import { CouponRo, PromoRo } from "interfaces";
import { useCallback, useMemo, useRef } from "react";
import { when } from "utils";
import omit from "lodash/omit";
import { useParams } from "@reach/router";
import { format, parseISO } from "date-fns";

export interface IPromoFormState
  extends Omit<PromoRo, "_id" | "createdAt" | "updatedAt" | "coupon"> {
  coupon: CouponRo;
  by: "percent" | "amount";
}

const transformPromoToFormState = (promo: PromoRo): IPromoFormState | any => {
  return {
    ...promo,
    by: "amount",
    expires_at: when(
      !!promo?.expires_at,
      format(
        parseISO(promo?.expires_at ?? new Date().toISOString()),
        "yyyy-MM-dd"
      ),
      undefined
    ),
  };
};

export function usePromoForm(promo?: PromoRo) {
  const toast = useToast();
  const { id } = useParams();
  const { isOpen, onClose, onOpen } = useDisclosure();

  // const initialChanges = useRef<IPromoFormState>(
  //   transformPromoToFormState((promo ?? {}) as any)
  // );
  const hasChanges = useRef<boolean>(false);

  const { createPromo, updatePromo, isLoading } = usePromoMutations();

  const [state, set] = usePartialState<IPromoFormState>(
    transformPromoToFormState((promo ?? {}) as any),
    [promo]
  );

  console.log("State", state);

  const percent_or_amount_field = useMemo(
    () => when(state?.by === "percent", "percent_off", "amount_off"),
    [state?.by]
  );

  const setCoupon = useCallback(
    (updates: Partial<CouponRo>) =>
      set((state) => ({
        ...state,
        coupon: { ...state?.coupon, ...updates } as any,
      })),
    [set]
  );

  const setInflu = useCallback(
    (updates: Partial<IPromoFormState["influencer"]>) =>
      set((state) => ({
        ...state,
        influencer: { ...state?.influencer, ...updates } as any,
      })),
    [set]
  );

  const setRestrictions = useCallback(
    (updates: Partial<IPromoFormState["restrictions"]>) =>
      set((state) => ({
        ...state,
        restrictions: { ...state?.restrictions, ...updates } as any,
      })),
    [set]
  );

  const createNewPromo = async () => {
    const result = await createPromo({
      ...omit(state as any, ["by"]),
      coupon: {
        ...state?.coupon,
        duration: (state?.coupon?.duration as any) ?? "once",
        currency: state?.coupon?.currency ?? "gpb",
        amount_off: when(
          !!state?.coupon?.amount_off,
          +(state?.coupon?.amount_off ?? 0),
          undefined
        ),
        percent_off: when(
          !!state?.coupon?.percent_off,
          // Number(Number(state?.coupon?.percent_off ?? 0).toFixed(2)),
          +(state?.coupon?.percent_off ?? 0),
          undefined
        ),
      },
      restrictions: {
        first_time_transaction:
          state?.restrictions?.first_time_transaction ?? false,
        minimum_amount: when(
          +(state?.restrictions?.minimum_amount ?? 0) > 0,
          +(state?.restrictions?.minimum_amount ?? 0),
          undefined
        ),
        minimum_amount_currency: when(
          +(state?.restrictions?.minimum_amount ?? 0) > 0,
          state?.restrictions?.minimum_amount_currency,
          undefined
        ),
      },
      expires_at: state?.expires_at,
    } as any);

    return result;
  };

  const savePromoChanges = async () => {
    const result = await updatePromo(id, {
      ...omit(state as any, ["by"]),
      coupon: {
        ...state?.coupon,
        duration: (state?.coupon?.duration as any) ?? "once",
        currency: state?.coupon?.currency ?? "gpb",
        amount_off: when(
          !!state?.coupon?.amount_off,
          +(state?.coupon?.amount_off ?? 0),
          undefined
        ),
        percent_off: when(
          !!state?.coupon?.percent_off,
          // Number(Number(state?.coupon?.percent_off ?? 0).toFixed(2)),
          +(state?.coupon?.percent_off ?? 0),
          undefined
        ),
      },
      restrictions: {
        first_time_transaction:
          state?.restrictions?.first_time_transaction ?? false,
        minimum_amount: when(
          +(state?.restrictions?.minimum_amount ?? 0) > 0,
          +(state?.restrictions?.minimum_amount ?? 0),
          undefined
        ),
        minimum_amount_currency: when(
          +(state?.restrictions?.minimum_amount ?? 0) > 0,
          state?.restrictions?.minimum_amount_currency,
          undefined
        ),
      },
    } as any);

    return result;
  };

  const submitForm = (callback?: (result: PromoRo) => void) => async () => {
    onClose();
    const is_update = !!promo;
    const result = await when(is_update, savePromoChanges, createNewPromo)();
    if (!!result) {
      callback && callback(result);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Promo successfully ${when(
          is_update,
          "updated",
          "created"
        )}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return {
    state,
    set,
    setCoupon,
    setInflu,
    onOpen,
    onClose,
    isOpen,
    hasChanges: hasChanges.current,
    percent_or_amount_field,
    setRestrictions,
    isSubmiting: isLoading,
    submitForm,
  };
}
