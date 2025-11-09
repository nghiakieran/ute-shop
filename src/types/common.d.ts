type Pagination = {
  curPage: number;
  limitPage: number;
  totalPage: number;
  totalRows: number;
};

type Sort = 'desc' | 'asc';

type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

type BaseSliceState = {
  loading: boolean;
  error?: string;
};

type FormFieldError = {
  field: string;
  message: string;
};

type SelectOption = {
  label: string;
  value: string;
};

