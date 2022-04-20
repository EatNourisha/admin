import { useCallback } from "react";
// import { useSWRConfig } from "swr";
import { post } from "utils/makeRequest";

import {
  LoginDto,
  ApiResponse,
  AuthRo,
  RequestPasswordResetDto,
  RequestPasswordResetRo,
  ResetPasswordDto,
  ResetPasswordRo,
} from "interfaces";

import useAuthStore from "stores/auth";
import useErrorStore from "stores/error";
import { navigate } from "@reach/router";
import configs from "config";

export default function useAuth() {
  // const { mutate } = useSWRConfig();

  const {
    setStatus,
    setPasswordResetStatus,
    status,
    passwordReset,
    persist,
    exp,
    isVerified,
    isSignedIn,
    token,
    sub,
    hydrate,
    dehydrate,
  } = useAuthStore();

  const { actions } = useErrorStore();

  const login = useCallback(
    async (data: LoginDto) => {
      setStatus("loading");
      try {
        const res = (
          await post<ApiResponse<AuthRo>, LoginDto>("/auth/login", data)
        ).data as AuthRo;
        if (res)
          persist({
            ...res.user,
            sub: res.user._id,
            isVerified: res.user.emailVerified,
            token: res.token,
          });
      } catch (error: any) {
        actions?.setError({
          action: { type: "auth/login", payload: data },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      setStatus("success");
    },
    [setStatus, persist, actions]
  );

  const forgotPassword = useCallback(
    async (data: RequestPasswordResetDto) => {
      setPasswordResetStatus("loading");
      try {
        (
          await post<
            ApiResponse<RequestPasswordResetRo>,
            RequestPasswordResetDto
          >("/auth/request/reset", data)
        ).data as RequestPasswordResetRo;
      } catch (error: any) {
        actions?.setError({
          action: { type: "auth/forgotPassword", payload: data },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      setPasswordResetStatus("success");
    },
    [setPasswordResetStatus, actions]
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordDto) => {
      setPasswordResetStatus("loading");
      try {
        (
          await post<ApiResponse<ResetPasswordRo>, ResetPasswordDto>(
            "/auth/reset",
            data
          )
        ).data as ResetPasswordRo;
      } catch (error: any) {
        actions?.setError({
          action: { type: "auth/resetPassword", payload: data },
          message: error?.message,
          status: error?.statusCode,
          showUser: true,
        });
      }
      setPasswordResetStatus("success");
    },
    [setPasswordResetStatus, actions]
  );

  const logout = useCallback(() => {
    dehydrate();
    navigate(configs.paths.login);
  }, [dehydrate]);

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    status,
    isSignedIn,
    token,
    sub,
    exp,
    isVerified,
    passwordReset,
    dehydrate,
    hydrate,
    persist,
  };
}
