import { useCallback } from 'react';
import toast from 'react-hot-toast';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export const useToast = () => {
  const toastFn = useCallback(({ 
    title, 
    description, 
    variant = 'default',
    duration,
  }: ToastProps) => {
    // Determine duration based on variant if not explicitly provided
    const toastDuration = duration ?? (variant === 'destructive' ? 4000 : 3000);

    // Build message
    const message = description ? `${title}\n${description}` : (title || 'Notification');

    // Common options
    const baseOptions = {
      duration: toastDuration,
      position: 'bottom-right' as const,
    };

    // Show toast based on variant
    switch (variant) {
      case 'destructive':
        return toast.error(message, baseOptions);
      case 'success':
        return toast.success(message, baseOptions);
      default:
        return toast(message, baseOptions);
    }
  }, []);

  return { 
    toast: toastFn,
    success: (titleOrProps: string | ToastProps) => {
      if (typeof titleOrProps === 'string') {
        toastFn({ title: titleOrProps, variant: 'success' });
      } else {
        toastFn({ ...titleOrProps, variant: 'success' });
      }
    },
    error: (titleOrProps: string | ToastProps) => {
      if (typeof titleOrProps === 'string') {
        toastFn({ title: titleOrProps, variant: 'destructive' });
      } else {
        toastFn({ ...titleOrProps, variant: 'destructive' });
      }
    },
    dismiss: toast.dismiss,
    remove: toast.remove,
  };
};