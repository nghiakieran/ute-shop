/**
 * Toast notification component
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast, ToastProps } from '@/hooks/useToast';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toastState, dismiss } = useToast();

  return (
    <>
      {children}
      <AnimatePresence>
        {toastState && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div
              className={`rounded-lg shadow-lg p-4 border ${
                toastState.variant === 'destructive'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {toastState.variant === 'destructive' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                )}
                <div className="flex-1">
                  {toastState.title && (
                    <h4 className="font-semibold text-sm mb-1">{toastState.title}</h4>
                  )}
                  {toastState.description && (
                    <p className="text-sm opacity-90">{toastState.description}</p>
                  )}
                </div>
                <button
                  onClick={dismiss}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Toast: React.FC<ToastProps> = () => null;

