import create from "zustand";
import produce from "immer";
import { nanoid } from "nanoid";
// import omit from "lodash/omit";

import { ErrorType } from "interfaces";
// import ls from "utils/secureStorage";
// import constants from "config";

interface ErrorStateActions {
  setError: (error: Partial<ErrorType>) => void;
  clearError: (type: ClearErrorType) => void;
}

interface ErrorState {
  previous: ErrorType;
  next: ErrorType;

  actions?: ErrorStateActions;
}

type ClearErrorType = "next" | "previous" | "both";

const initialState: ErrorState = {
  previous: {
    id: null,
    message: null,
    status: null,
    action: null,
    showUser: false,
  },
  next: {
    id: null,
    message: null,
    status: null,
    action: null,
    showUser: false,
  },
};

export const useErrorStore = create<ErrorState>((set) => ({
  ...initialState,

  actions: {
    setError: (error: Partial<ErrorType>) =>
      set(
        produce((state: ErrorState) => {
          //   console.log("error", error);
          const id = `${error.action?.type ?? "error"}-${nanoid(7)}`;
          if (state?.previous?.id === null && state?.next?.id === null) {
            state.previous = { ...error, id };
            state.next = { ...error, id };

            return;
          } else if (state?.previous?.id !== null && state?.next?.id === null) {
            state.previous = { ...state.previous };
            state.next = { ...error, id };
            return;
          } else {
            state.previous = { ...state?.next };
            state.next = { ...error, id };
            return;
          }
        })
      ),

    clearError: (type: ClearErrorType) =>
      set(
        produce((state: ErrorState) => {
          const mapActions = (type: ClearErrorType) => {
            const map = {
              next: () => {
                state.previous = { ...state.next };
                state.next = { ...initialState.next };
              },
              previous: () => {
                state.previous = { ...state.next };
                state.next = { ...initialState.next };
              },
              both: () => {
                state = { ...initialState };
              },
            };

            return map[type]();
          };

          mapActions(type);
        })
      ),
  },
}));

export default useErrorStore;
