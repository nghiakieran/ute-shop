/**
 * Formatting Utility Functions
 */

export const formatUtils = {
  // Format currency (VND)
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  },

  // Format date
  formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'short') {
      return new Intl.DateTimeFormat('vi-VN').format(dateObj);
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  },

  // Format phone number
  formatPhone(phone: string): string {
    // Format: 0xxx xxx xxx
    if (phone.length === 10) {
      return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
  },

  // Truncate text
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  },

  // Capitalize first letter
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Format number with thousand separator
  formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
  },
};

