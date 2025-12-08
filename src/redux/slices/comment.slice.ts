import { createAppSlice } from '../createAppSlice';
import {
  createComment as createCommentApi,
  getProductComments as getProductCommentsApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from '@/utils/comment.api';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/types/comment';

interface CommentState {
  comments: Comment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  } | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

const initialState: CommentState = {
  comments: [],
  pagination: null,
  loading: false,
  error: null,
  submitting: false,
};

export const commentSlice = createAppSlice({
  name: 'comment',
  initialState,
  reducers: (create) => ({
    // ==================== FETCH PRODUCT COMMENTS ====================
    fetchProductComments: create.asyncThunk(
      async (
        { productId, page = 1, limit = 10 }: { productId: number; page?: number; limit?: number },
        { rejectWithValue }
      ) => {
        try {
          const response = await getProductCommentsApi(productId, page, limit);
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch comments');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          // If page > 1, append comments; otherwise replace
          if (action.payload.page > 1) {
            state.comments = [...state.comments, ...action.payload.comments];
          } else {
            state.comments = action.payload.comments;
          }
          state.pagination = {
            total: action.payload.total,
            page: action.payload.page,
            limit: action.payload.limit,
          };
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== SUBMIT COMMENT ====================
    submitComment: create.asyncThunk(
      async (data: CreateCommentRequest, { rejectWithValue }) => {
        try {
          const response = await createCommentApi(data);
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to submit comment');
        }
      },
      {
        pending: (state) => {
          state.submitting = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.submitting = false;
          // Add new comment to the list
          if (action.payload.parentId) {
            // If it's a reply, find parent and add to replies
            const parent = state.comments.find((c) => c.id === action.payload.parentId);
            if (parent) {
              if (!parent.replies) {
                parent.replies = [];
              }
              parent.replies.push(action.payload);
            }
          } else {
            // If it's a top-level comment, add to the beginning
            state.comments.unshift(action.payload);
            if (state.pagination) {
              state.pagination.total += 1;
            }
          }
        },
        rejected: (state, action) => {
          state.submitting = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== EDIT COMMENT ====================
    editComment: create.asyncThunk(
      async (
        { id, data }: { id: number; data: UpdateCommentRequest },
        { rejectWithValue }
      ) => {
        try {
          const response = await updateCommentApi(id, data);
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to update comment');
        }
      },
      {
        pending: (state) => {
          state.submitting = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.submitting = false;
          // Update comment in the list
          const updateCommentInList = (comments: Comment[]): boolean => {
            for (const comment of comments) {
              if (comment.id === action.payload.id) {
                comment.description = action.payload.description;
                comment.updatedAt = action.payload.updatedAt;
                return true;
              }
              if (comment.replies) {
                if (updateCommentInList(comment.replies)) {
                  return true;
                }
              }
            }
            return false;
          };
          updateCommentInList(state.comments);
        },
        rejected: (state, action) => {
          state.submitting = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== REMOVE COMMENT ====================
    removeComment: create.asyncThunk(
      async (id: number, { rejectWithValue }) => {
        try {
          await deleteCommentApi(id);
          return id;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to delete comment');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          // Remove comment from the list
          const removeCommentFromList = (comments: Comment[]): boolean => {
            const index = comments.findIndex((c) => c.id === action.payload);
            if (index !== -1) {
              comments.splice(index, 1);
              if (state.pagination) {
                state.pagination.total -= 1;
              }
              return true;
            }
            for (const comment of comments) {
              if (comment.replies) {
                if (removeCommentFromList(comment.replies)) {
                  return true;
                }
              }
            }
            return false;
          };
          removeCommentFromList(state.comments);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== CLEAR ERROR ====================
    clearError: create.reducer((state) => {
      state.error = null;
    }),

    // ==================== CLEAR COMMENTS ====================
    clearComments: create.reducer((state) => {
      state.comments = [];
      state.pagination = null;
    }),
  }),
});

// Export actions
export const {
  fetchProductComments,
  submitComment,
  editComment,
  removeComment,
  clearError,
  clearComments,
} = commentSlice.actions;

// Export selectors
export const selectComments = (state: { comment: CommentState }) => state.comment.comments;
export const selectCommentPagination = (state: { comment: CommentState }) =>
  state.comment.pagination;
export const selectCommentLoading = (state: { comment: CommentState }) => state.comment.loading;
export const selectCommentSubmitting = (state: { comment: CommentState }) =>
  state.comment.submitting;
export const selectCommentError = (state: { comment: CommentState }) => state.comment.error;

export default commentSlice.reducer;
