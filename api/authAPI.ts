import {
  LoginData,
  OtpData,
  RegisterData,
  ResetPasswordData,
  ResetTokenResponse,
  TempTokenResponse,
  TokenResponse,
  UserResponse,
} from "@/types/authAPI";
import Cookies from "js-cookie";
import { authInstance } from "./axiosInstance";

// Login (returns temp_token)
export const loginAPI = async (
  loginData: LoginData
): Promise<TempTokenResponse> => {
  const res = await authInstance.post<TempTokenResponse>("/login", loginData);
  if (res.data.temp_token) {
    Cookies.set("tempToken", res.data.temp_token, {
      secure: true,
      sameSite: "strict",
    });
  }
  return res.data;
};

// Register (returns temp_token)
export const registerAPI = async (
  registerData: RegisterData
): Promise<TempTokenResponse> => {
  const res = await authInstance.post<TempTokenResponse>(
    "/create",
    registerData
  );
  if (res.data.temp_token) {
    Cookies.set("tempToken", res.data.temp_token, {
      secure: true,
      sameSite: "strict",
    });
  }
  return res.data;
};

// Request OTP (requires temp_token)
export const requestOtpAPI = async (
  purpose: string
): Promise<{ message: string }> => {
  const tempToken = Cookies.get("tempToken");
  if (!tempToken) throw new Error("No temp token found");

  const res = await authInstance.post<{ message: string }>(
    "/request-otp",
    { purpose },
    { headers: { Authorization: `Bearer ${tempToken}` } }
  );
  return res.data;
};

// Verify OTP (returns access/refresh/reset tokens)
export const verifyOtpAPI = async (
  otpData: OtpData
): Promise<TokenResponse | ResetTokenResponse> => {
  const tempToken = Cookies.get("tempToken");
  if (!tempToken) throw new Error("No temp token found");

  const res = await authInstance.post<TokenResponse | ResetTokenResponse>(
    "/verify-otp",
    otpData,
    { headers: { Authorization: `Bearer ${tempToken}` } }
  );

  if ("access_token" in res.data) {
    Cookies.set("accessToken", res.data.access_token, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", res.data.refresh_token, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.remove("tempToken");
  }

  if ("reset_token" in res.data) {
    Cookies.set("resetToken", res.data.reset_token, {
      secure: true,
      sameSite: "strict",
    });
  }

  return res.data;
};

// Request password reset (returns temp_token)
export const requestPasswordResetAPI = async (
  email: string
): Promise<TempTokenResponse> => {
  const res = await authInstance.post<TempTokenResponse>(
    "/request-password-reset",
    { email }
  );
  if (res.data.temp_token) {
    Cookies.set("tempToken", res.data.temp_token, {
      secure: true,
      sameSite: "strict",
    });
  }
  return res.data;
};

// Reset password (requires reset_token)
export const resetPasswordAPI = async (
  data: ResetPasswordData
): Promise<{ message: string }> => {
  const resetToken = Cookies.get("resetToken");
  if (!resetToken) throw new Error("No reset token found");

  const res = await authInstance.post<{ message: string }>(
    "/reset-password",
    data,
    { headers: { Authorization: `Bearer ${resetToken}` } }
  );

  Cookies.remove("resetToken");
  return res.data;
};

// Get current user (requires access_token)
export const getCurrentUserAPI = async (): Promise<UserResponse> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) throw new Error("No access token found");

  const res = await authInstance.get<UserResponse>("/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return res.data;
};

// Logout (clears tokens)
export const logoutAPI = (): void => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("tempToken");
  Cookies.remove("resetToken");
  localStorage.removeItem("user");
};
