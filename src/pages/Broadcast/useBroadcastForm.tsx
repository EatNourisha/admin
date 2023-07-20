import { useDisclosure, useToast } from "@chakra-ui/react";
import usePartialState from "hooks/usePartialState";
import useBroadcastMutations from "hooks/useBroadcastMutations";
import { AddNewBroadcastDto, BroadcastRo } from "interfaces";
import { useEffect, useRef } from "react";

import isEqual from "lodash/isEqual";
import { useLocation } from "@reach/router";

export interface IBroadcastFormState extends AddNewBroadcastDto {}

const transformBroadcastToFormState = (
  broadcast: BroadcastRo
): IBroadcastFormState => {
  return {
    title: broadcast?.title,
    tag: String(broadcast?.tag ?? "marketing"),
    content: broadcast?.content,
  };
};

export function useBroadcastForm(broadcast?: BroadcastRo) {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { state: duplicatedCast } = useLocation();

  const initialChanges = useRef<IBroadcastFormState>(
    transformBroadcastToFormState((duplicatedCast ?? {}) as any)
  );
  const hasChanges = useRef<boolean>(false);

  const [state, set] = usePartialState<IBroadcastFormState>(
    transformBroadcastToFormState((duplicatedCast ?? {}) as any),
    [duplicatedCast]
  );

  const { addNewBroadcast, isLoading } = useBroadcastMutations();

  const createBroadcast = async () => {
    const result = await addNewBroadcast({
      ...(state as any),
    });

    return result;
  };

  const submitForm = (callback?: (result: BroadcastRo) => void) => async () => {
    onClose();
    const result = await createBroadcast();

    if (!!result) {
      callback && callback(result);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Broadcast successfully sent!`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!isEqual(initialChanges.current, state)) {
      hasChanges.current = true;
      initialChanges.current = transformBroadcastToFormState(broadcast as any);
    } else {
      hasChanges.current = false;
      initialChanges.current = transformBroadcastToFormState(broadcast as any);
    }
  }, [initialChanges, state, hasChanges, broadcast]);

  return {
    state,
    set,
    isLoading,
    submitForm,
    isOpen,
    onClose,
    onOpen,
    hasChanges: hasChanges.current,
  };
}
