/**
 * Auth Layout
 * Layout cho trang đăng nhập, đăng ký, quên mật khẩu
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex justify-center mb-8">
            <span className="font-serif text-3xl font-bold text-neutral-900">
              UTEShop
            </span>
          </Link>

          {/* Title */}
          {title && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-neutral-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          {children}
        </motion.div>
      </div>

      {/* Right Side - Image/Banner */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-100 via-primary-50 to-neutral-100 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-lg"
        >
          <h2 className="font-serif text-4xl font-bold text-neutral-900 mb-6">
            Khám phá phong cách của bạn
          </h2>
          <p className="text-lg text-neutral-700 mb-8">
            Thời trang hiện đại, sang trọng và tối giản theo phong cách châu Âu
          </p>
          
          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-primary-200/50 animate-pulse" />
            <div className="w-20 h-20 rounded-full bg-primary-300/50 animate-pulse delay-75" />
            <div className="w-20 h-20 rounded-full bg-primary-200/50 animate-pulse delay-150" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

