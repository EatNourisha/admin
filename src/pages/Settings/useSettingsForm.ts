import { useDisclosure, useToast } from "@chakra-ui/react";
import usePartialState from "hooks/usePartialState";
import useSettingsMutations from "hooks/useSettingsMutations";
import { SettingsRo } from "interfaces";
import { useMemo } from "react";

import isEqual from "lodash/isEqual";
import { when } from "utils";

export interface ISettingsFormState
  extends Omit<SettingsRo, "_id" | "createdAt" | "updatedAt"> {
  is_uploading?: boolean;
}

const transformSettingsToFormState = (
  settings: SettingsRo
): ISettingsFormState => {
  return {
    name: settings?.name,
    currency: settings?.currency,
    delivery_fee: settings?.delivery_fee,
    delivery_fee_calculation_type: settings?.delivery_fee_calculation_type,
  };
};

export function useSettingsForm(settings?: SettingsRo) {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  //   const initialChanges = useRef<ISettingsFormState>(
  //     transformSettingsToFormState((settings ?? {}) as any)
  //   );
  //   const hasChanges = useRef<boolean>(false);

  const [state, set] = usePartialState<ISettingsFormState>(
    transformSettingsToFormState((settings ?? {}) as any),
    [settings]
  );

  const hasChanges = useMemo(
    () => !isEqual(settings, state),
    [settings, state]
  );

  const { updateSettings, isLoading } = useSettingsMutations(["settings"]);

  const saveSettingsChanges = async () => {
    const result = await updateSettings({
      ...(state as any),
    });

    return result;
  };

  const submitForm = (callback?: (result: SettingsRo) => void) => async () => {
    onClose();
    const is_update = !!settings;
    // const result = await when(is_update, saveSettingsChanges, createSettings)();
    const result = await saveSettingsChanges();
    if (!!result) {
      callback && callback(result);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Settings successfully ${when(
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

  //   useEffect(() => {
  //     if (!isEqual(initialChanges.current, state)) {
  //       //   hasChanges.current = true;
  //       initialChanges.current = transformSettingsToFormState(settings as any);
  //     } else {
  //       //   hasChanges.current = false;
  //       initialChanges.current = transformSettingsToFormState(settings as any);
  //     }
  //   }, [initialChanges, state, hasChanges, settings]);

  console.log("State", state);

  return {
    state,
    set,
    isLoading: isLoading || state?.is_uploading,
    submitForm,
    isOpen,
    onClose,
    onOpen,
    hasChanges,
  };
}
