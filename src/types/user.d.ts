type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
};

type UpdateProfilePayload = {
  fullName?: string;
  phone?: string;
  avatar?: string;
};

type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
