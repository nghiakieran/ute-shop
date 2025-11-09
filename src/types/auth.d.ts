type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  phone?: string;
  agreedToTerms?: boolean;
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
  otp: string;
};

type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

