interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface OtpData {
  code: string;
  purpose: string;
}

interface ResetPasswordData {
  new_password: string;
}

interface TempTokenResponse {
  temp_token: string;
  message: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface ResetTokenResponse {
  reset_token: string;
  message: string;
}

interface UserResponse {
  user_id: string;
  email: string;
  name: string;
  profile_image_url?: string | null;
  is_active: boolean;
  is_verified: boolean;
  total_xp: number;
  savings?: number;
  goals_completed?: number;
  created_at: string;
  rank: string | number;
}

export type {
  LoginData,
  RegisterData,
  OtpData,
  ResetPasswordData,
  TempTokenResponse,
  TokenResponse,
  ResetTokenResponse,
  UserResponse,
};
