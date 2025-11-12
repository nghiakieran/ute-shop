/**
 * useToast hook for toast notifications
 * Uses react-hot-toast for notifications
 */

import { useCallback } from 'react';
import toast from 'react-hot-toast';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export const useToast = () => {
  const toastFn = useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    const message = description || title || 'Notification';

    switch (variant) {
      case 'destructive':
        toast.error(message, {
          position: 'top-right',
          duration: 4000,
        });
        break;
      case 'success':
        toast.success(message, {
          position: 'top-right',
          duration: 3000,
        });
        break;
      default:
        toast(message, {
          position: 'top-right',
          duration: 3000,
        });
    }
  }, []);

  return { toast: toastFn };
};
