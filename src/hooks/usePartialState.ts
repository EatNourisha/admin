import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import { useUpdateEffect } from "@chakra-ui/react";
import isEqual from "lodash/isEqual";

type SetArgType<T> = T | ((draft: T) => void | T);

export default function usePartialState<T>(
  initialState?: Partial<T>,
  dependencies: any[] = []
) {
  const isSetCalled = useRef(false);
  const dependencyRef = useRef<any[]>([]);
  const initialStateBackup = useRef(initialState);
  const [s, _set] = useState(initialState);

  const set = useCallback(
    (update: SetArgType<NonNullable<typeof initialState>>) => {
      isSetCalled.current = true;
      const update_type = typeof update;

      if (update_type === "function")
        return _set(produce((draft: any) => (update as any)(draft)));
      else return _set((oldState) => ({ ...oldState, ...update }));
    },
    []
  );

  const reset = useCallback(() => {
    _set(() => ({ ...initialStateBackup.current }));
    return;
  }, []);

  useUpdateEffect(() => {
    if (!isEqual(dependencyRef.current, dependencies)) {
      _set(initialState);
      dependencyRef.current = dependencies;
    }
  }, [...dependencies, dependencyRef, initialState]);

  const arr: [typeof initialState, typeof set, typeof reset] = [s, set, reset];
  return arr;
}
