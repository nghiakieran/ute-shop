/**
 * useToast hook for toast notifications
 */

import { useState, useCallback } from 'react';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastTimeout: NodeJS.Timeout | null = null;

export const useToast = () => {
  const [toastState, setToastState] = useState<ToastProps | null>(null);

  const toast = useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    setToastState({ title, description, variant });

    // Auto dismiss after 3 seconds
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastTimeout = setTimeout(() => {
      setToastState(null);
    }, 3000);
  }, []);

  const dismiss = useCallback(() => {
    setToastState(null);
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
  }, []);

  return { toast, toastState, dismiss };
};

