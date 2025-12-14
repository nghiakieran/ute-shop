import { apiClient } from '@/utils/api.utils';
import { API_ENDPOINTS } from '@/constants';
import type {
  CreateCommentRequest,
  UpdateCommentRequest,
  Comment,
  CommentListResponse,
} from '@/types/comment';

/**
 * Create a new comment
 */
export const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
  const response = await apiClient.post<Comment>(API_ENDPOINTS.CREATE_COMMENT, data);
  return response.data.data;
};

/**
 * Get comments for a specific product
 */
export const getProductComments = async (
  productId: number,
  page: number = 1,
  limit: number = 10
): Promise<CommentListResponse> => {
  const url = API_ENDPOINTS.GET_PRODUCT_COMMENTS.replace(':productId', productId.toString());
  const response = await apiClient.get<CommentListResponse>(url, {
    params: { page, limit },
  });
  return response.data.data;
};

/**
 * Get a single comment by ID
 */
export const getComment = async (id: number): Promise<Comment> => {
  const url = API_ENDPOINTS.GET_COMMENT.replace(':id', id.toString());
  const response = await apiClient.get<Comment>(url);
  return response.data.data;
};

/**
 * Update a comment
 */
export const updateComment = async (
  id: number,
  data: UpdateCommentRequest
): Promise<Comment> => {
  const url = API_ENDPOINTS.UPDATE_COMMENT.replace(':id', id.toString());
  const response = await apiClient.put<Comment>(url, data);
  return response.data.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (id: number): Promise<void> => {
  const url = API_ENDPOINTS.DELETE_COMMENT.replace(':id', id.toString());
  await apiClient.delete(url);
};

/**
 * Get current user's comments
 */
export const getMyComments = async (
  page: number = 1,
  limit: number = 10
): Promise<CommentListResponse> => {
  const response = await apiClient.get<CommentListResponse>(API_ENDPOINTS.GET_MY_COMMENTS, {
    params: { page, limit },
  });
  return response.data.data;
};
