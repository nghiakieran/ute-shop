/**
 * Loading Component
 * Beautiful loading spinner
 */

import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full"
      />
    </div>
  );
};

