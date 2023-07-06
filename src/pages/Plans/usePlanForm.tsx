import { useDisclosure, useToast } from "@chakra-ui/react";
import usePartialState from "hooks/usePartialState";
import usePlanMutations from "hooks/usePlanMutations";
import { PlanRo } from "interfaces";
import { useEffect, useMemo, useRef, useState } from "react";
import { when } from "utils";

import isEqual from "lodash/isEqual";
import { useParams } from "@reach/router";

export type PerkType = {
  index: number;
  content: string;
  removed: boolean;
  editMode?: boolean;
};

export interface IPlanFormState
  extends Omit<
    PlanRo,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "amount"
    | "perks"
    | "product_id"
    | "price_id"
    | "slug"
  > {
  amount: string;
  perks: PerkType[];
}

const transformPlanToFormState = (plan: PlanRo): IPlanFormState => {
  return {
    name: plan?.name,
    amount: String(plan?.amount ?? ""),
    currency: plan?.currency ?? "gbp",
    description: plan?.description,
    subscription_interval: plan?.subscription_interval,
    perks: (plan?.perks ?? []).map((perk, i) => ({
      index: i,
      content: perk,
      editMode: false,
      removed: false,
    })),
  };
};

export function usePlanForm(plan?: PlanRo) {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { id } = useParams();

  const initialChanges = useRef<IPlanFormState>(
    transformPlanToFormState((plan ?? {}) as any)
  );
  const hasChanges = useRef<boolean>(false);

  const [state, set] = usePartialState<IPlanFormState>(
    transformPlanToFormState((plan ?? {}) as any),
    [plan]
  );

  const hasPerks = useMemo(
    () => (state?.perks ?? []).length > 0,
    [state?.perks]
  );

  const [perkDraft, setPerkDraft] = useState<PerkType | null>(null);

  const { addNewPlan, updatePlan, isLoading } = usePlanMutations();

  const addPerkDraft = () => {
    const perks = state?.perks ?? [];
    const index_already_exist =
      perks.findIndex((p) => p.index === perks.length) > -1;

    setPerkDraft({
      index: when(index_already_exist, perks.length + 1, perks.length),
      content: "",
      removed: false,
    });
  };

  const savePerkDraft = (perk: Partial<PerkType>) => {
    console.log("Perk to save", perk);
    set((draft) => {
      let edited_perk = draft.perks?.find((p) => p.index === perk?.index);
      if (!!edited_perk) {
        edited_perk.content = perk?.content!;
        edited_perk.editMode = perk?.editMode;
        edited_perk.removed = perk?.removed!;
      } else {
        draft.perks = [...(draft?.perks ?? []), perk as any];
      }
    });
    setPerkDraft(null);
  };

  const removePerk = (perk: Partial<PerkType>) => {
    set((draft) => {
      draft.perks = draft.perks?.filter((p) => p?.index !== perk?.index);
    });
    setPerkDraft(null);
  };

  const togglePerkEditMode = (index: number) => {
    set((draft) => {
      const perk = draft.perks?.find((p) => p?.index === index);
      if (!!perk) perk.editMode = !perk?.editMode;
    });
  };

  const createPlan = async () => {
    const result = await addNewPlan({
      ...(state as any),
      amount: +(state?.amount ?? 0),
      perks: (state?.perks ?? []).map((pk) => pk?.content),
    });

    return result;
  };

  const savePlanChanges = async () => {
    const result = await updatePlan(id, {
      ...(state as any),
      amount: +(state?.amount ?? 0),
      perks: (state?.perks ?? []).map((pk) => pk?.content),
    });

    return result;
  };

  const submitForm = (callback?: (result: PlanRo) => void) => async () => {
    onClose();
    const is_update = !!plan;
    const result = await when(is_update, savePlanChanges, createPlan)();
    if (!!result) {
      callback && callback(result);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Plan successfully ${when(
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

  useEffect(() => {
    if (!isEqual(initialChanges.current, state)) {
      hasChanges.current = true;
      initialChanges.current = transformPlanToFormState(plan as any);
    } else {
      hasChanges.current = false;
      initialChanges.current = transformPlanToFormState(plan as any);
    }
  }, [initialChanges, state, hasChanges, plan]);

  return {
    state,
    set,
    perkDraft,
    addPerkDraft,
    hasPerks,
    savePerkDraft,
    removePerk,
    togglePerkEditMode,
    isLoading,
    submitForm,
    isOpen,
    onClose,
    onOpen,
    hasChanges: hasChanges.current,
  };
}
