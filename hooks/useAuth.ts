"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginAPI,
  registerAPI,
  requestOtpAPI,
  verifyOtpAPI,
  requestPasswordResetAPI,
  resetPasswordAPI,
  getCurrentUserAPI,
  logoutAPI,
} from "@/api/authAPI";
import {
  LoginData,
  RegisterData,
  OtpData,
  ResetPasswordData,
  TempTokenResponse,
  TokenResponse,
  ResetTokenResponse,
  UserResponse,
} from "@/types/authAPI";
import { useRouter } from "next/navigation";
import { useNabilAccountStore } from "@/stores/useNabilAccountStore";
import { queryKeys } from "@/lib/queryKeys";

export const useLogin = () => {
  return useMutation<TempTokenResponse, Error, LoginData>({
    mutationFn: loginAPI,
  });
};

export const useRegister = () => {
  return useMutation<TempTokenResponse, Error, RegisterData>({
    mutationFn: registerAPI,
  });
};

export const useRequestOtp = () => {
  return useMutation<{ message: string }, Error, string>({
    mutationFn: requestOtpAPI,
  });
};

export const useVerifyOtp = () => {
  return useMutation<TokenResponse | ResetTokenResponse, Error, OtpData>({
    mutationFn: verifyOtpAPI,
  });
};

export const useRequestPasswordReset = () => {
  return useMutation<TempTokenResponse, Error, string>({
    mutationFn: requestPasswordResetAPI,
  });
};

export const useResetPassword = () => {
  return useMutation<{ message: string }, Error, ResetPasswordData>({
    mutationFn: resetPasswordAPI,
  });
};

export const useCurrentUser = () => {
  return useQuery<UserResponse, Error>({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUserAPI,
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearNabilAccountId = useNabilAccountStore(
    (state) => state.clearNabilAccountId,
  );

  return useMutation<void, Error, void>({
    mutationFn: () => Promise.resolve(logoutAPI()),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.currentUser });
      clearNabilAccountId();
      router.push("/auth/login");
    },
  });
};
