import { useCallback, useState } from "react";

export default function usePartialState<T>(initialState: Partial<T>) {
  const [s, _set] = useState(initialState);
  const set = useCallback((update: typeof initialState) => {
    _set((oldState) => ({ ...oldState, ...update }));
    return;
  }, []);
  const arr: [typeof initialState, typeof set] = [s, set];
  return arr;
}
