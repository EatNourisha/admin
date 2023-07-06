import create, { State } from "zustand";
import { produce } from "immer";
import omit from "lodash/omit";

import { AppStatus } from "interfaces";
import ls from "utils/secureStorage";
import configs from "config";

interface AuthState extends State {
  isSignedIn: boolean;
  sub: string | null;
  token: string | null;
  isVerified: boolean;
  roles: string[];
  exp: number | null;
  status: AppStatus;

  passwordReset: {
    status: AppStatus;
  };

  hydrate: () => void;
  dehydrate: () => void;
  setStatus: (status: AppStatus) => void;
  persist: (data: Partial<AuthState>) => void;
  setPasswordResetStatus: (status: AppStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  sub: null,
  isSignedIn: false,
  token: null,
  isVerified: false,
  roles: [],
  exp: null,
  status: "idle",

  passwordReset: {
    status: "idle",
  },

  persist: (data: Partial<AuthState>) =>
    set(
      produce((state) => {
        const auth = { ...data, isSignedIn: true };
        ls.set(configs.authKey, auth);
        return auth;
      })
    ),

  hydrate: () =>
    set(
      produce((state: AuthState) => {
        const auth = ls.get(configs.authKey) as AuthState;
        return { ...(auth ?? omit(state, ["persist", "hydrate"])) };
      })
    ),

  dehydrate: () =>
    set(
      produce((_: AuthState) => {
        ls.remove(configs.authKey);
        return {
          sub: null,
          isSignedIn: false,
          token: null,
          isVerified: false,
          roles: [],
          exp: null,
          status: "idle",
        };
      })
    ),

  setStatus: (status: AppStatus) =>
    set(
      produce((state: AuthState) => {
        state.status = status;
      })
    ),

  setPasswordResetStatus: (status: AppStatus) =>
    set(
      produce((state: AuthState) => {
        state.passwordReset.status = status;
      })
    ),
}));

export default useAuthStore;
