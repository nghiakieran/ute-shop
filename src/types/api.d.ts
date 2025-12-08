type ApiResponse<T = any> = {
  isFavourite: any;
  success: boolean;
  data: T;
  message?: string;
};

type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ApiRequestConfig = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
};
