import { loginAPI, registerAPI, requestPasswordResetAPI, resetPasswordAPI, verifyOtpAPI } from "@/api/authAPI";
import { LoginData, RegisterData, ResetPasswordData, ResetTokenResponse, TempTokenResponse, TokenResponse } from "@/types/authAPI";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation<TempTokenResponse, Error, LoginData, unknown>(loginAPI);

export const useRegister = () =>
  useMutation<TempTokenResponse, Error, RegisterData, unknown>(registerAPI);

export const useRequestOtp = () =>
  useMutation<{ message: string }, Error, string, unknown>(requestOtpAPI);

export const useVerifyOtp = () =>
  useMutation<TokenResponse | ResetTokenResponse, Error, OtpData, unknown>(
    verifyOtpAPI
  );

export const useRequestPasswordReset = () =>
  useMutation<TempTokenResponse, Error, string, unknown>(
    requestPasswordResetAPI
  );

export const useResetPassword = () =>
  useMutation<{ message: string }, Error, ResetPasswordData, unknown>(
    resetPasswordAPI
  );
