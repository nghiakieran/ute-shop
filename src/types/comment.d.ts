export interface Comment {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
  };
  replies?: Comment[];
  parentId?: number;
}

export interface CreateCommentRequest {
  productId: number;
  description: string;
  parentId?: number;
  billId?: number;
}

export interface UpdateCommentRequest {
  description: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
}

export interface CommentResponse {
  data: Comment;
  message: string;
  status: number;
}

export interface CommentListApiResponse {
  data: CommentListResponse;
  message: string;
  status: number;
}
