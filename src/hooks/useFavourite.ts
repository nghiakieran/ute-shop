import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  toggleWishlistAsync,
  selectIsInWishlist,
  selectWishlistLoading,
} from '@/redux/slices/wishlist.slice';
import toast from 'react-hot-toast';

export const useFavourite = (productId: number) => {
  const dispatch = useAppDispatch();
  const isFavourite = useAppSelector(selectIsInWishlist(productId));
  const isLoading = useAppSelector(selectWishlistLoading);

  const toggleFavourite = async () => {
    // Check current state BEFORE toggle
    const wasFavourite = isFavourite;

    try {
      await dispatch(toggleWishlistAsync(productId)).unwrap();
      // Show message based on previous state
      toast.success(wasFavourite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
    } catch (error) {
      toast.error('Không thể cập nhật yêu thích');
      console.error('Error toggling favourite:', error);
    }
  };

  return {
    isFavourite,
    isLoading,
    toggleFavourite,
  };
};
