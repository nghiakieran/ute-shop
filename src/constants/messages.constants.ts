/**
 * Message Constants
 */

export const MESSAGES = {
  // Success
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  UPDATE_PROFILE_SUCCESS: 'Cập nhật thông tin thành công!',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công!',
  FORGOT_PASSWORD_SUCCESS: 'Đã gửi mã OTP đến email của bạn!',
  RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công!',

  // Error
  LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!',
  REGISTER_FAILED: 'Đăng ký thất bại. Vui lòng thử lại!',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng!',
  EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng!',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại!',
  SERVER_ERROR: 'Lỗi hệ thống. Vui lòng thử lại sau!',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
  OTP_INVALID: 'Mã OTP không đúng!',
  OTP_EXPIRED: 'Mã OTP đã hết hạn!',
  PASSWORD_NOT_MATCH: 'Mật khẩu xác nhận không khớp!',
  WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!',

  // Validation
  REQUIRED_FIELD: 'Trường này là bắt buộc!',
  INVALID_EMAIL: 'Email không hợp lệ!',
  INVALID_PHONE: 'Số điện thoại không hợp lệ!',
  MIN_LENGTH: (min: number) => `Tối thiểu ${min} ký tự!`,
  MAX_LENGTH: (max: number) => `Tối đa ${max} ký tự!`,
} as const;

