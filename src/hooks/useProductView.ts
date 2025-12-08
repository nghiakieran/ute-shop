import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { trackView } from '@/redux/slices/recently-viewed.slice';

export const useProductView = (productId: number | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (productId) {
      // Track view after a short delay to ensure user intentionally viewed the product
      const timer = setTimeout(() => {
        dispatch(trackView(productId));
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, [productId, dispatch]);
};
