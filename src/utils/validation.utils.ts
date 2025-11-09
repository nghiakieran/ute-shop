/**
 * Validation Utility Functions
 */

import { MESSAGES } from '@/constants';

export const validationUtils = {
  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation (Vietnamese format)
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
  },

  // Password strength validation
  isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Required field validation
  isRequired(value: string | null | undefined): boolean {
    return !!value && value.trim().length > 0;
  },

  // Min length validation
  hasMinLength(value: string, min: number): boolean {
    return value.length >= min;
  },

  // Max length validation
  hasMaxLength(value: string, max: number): boolean {
    return value.length <= max;
  },

  // Validate email field
  validateEmail(email: string): string | null {
    if (!this.isRequired(email)) {
      return MESSAGES.REQUIRED_FIELD;
    }
    if (!this.isValidEmail(email)) {
      return MESSAGES.INVALID_EMAIL;
    }
    return null;
  },

  // Validate password field
  validatePassword(password: string): string | null {
    if (!this.isRequired(password)) {
      return MESSAGES.REQUIRED_FIELD;
    }
    if (!this.hasMinLength(password, 8)) {
      return MESSAGES.MIN_LENGTH(8);
    }
    if (!this.isStrongPassword(password)) {
      return MESSAGES.WEAK_PASSWORD;
    }
    return null;
  },

  // Validate confirm password
  validateConfirmPassword(password: string, confirmPassword: string): string | null {
    if (!this.isRequired(confirmPassword)) {
      return MESSAGES.REQUIRED_FIELD;
    }
    if (password !== confirmPassword) {
      return MESSAGES.PASSWORD_NOT_MATCH;
    }
    return null;
  },

  // Validate phone field
  validatePhone(phone: string): string | null {
    if (!this.isRequired(phone)) {
      return MESSAGES.REQUIRED_FIELD;
    }
    if (!this.isValidPhone(phone)) {
      return MESSAGES.INVALID_PHONE;
    }
    return null;
  },
};

