type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  // confirmPassword is for FE validation only, not sent to API
  confirmPassword?: string;
};

type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type VerifyOtpPayload = {
  email: string;
  password: string;
  fullName: string;
  otp: string;
};

type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};
