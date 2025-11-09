type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
};

type UpdateProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

