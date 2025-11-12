# Authentication System - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống xác thực đã được hoàn thiện với các tính năng:

1. **Đăng Ký (Register)** - với xác thực OTP qua email
2. **Đăng Nhập (Login)** - đăng nhập thông thường và Google OAuth
3. **Quên Mật Khẩu (Forgot Password)** - reset password với OTP
4. **Đăng Xuất (Logout)**
5. **Xác Thực OTP** - modal hiển thị inline khi cần verify

## Các Tính Năng Đã Triển Khai

### 1. Đăng Ký với OTP Verification

**Flow:**

1. User điền thông tin (name, email, password, confirmPassword)
2. Gửi request đến `/auth/register`
3. Backend gửi OTP về email
4. Hiển thị màn hình OTP verification
5. User nhập OTP (6 số)
6. Gửi request đến `/auth/verify-account` với email, password và OTP
7. Nếu thành công, tự động đăng nhập và redirect về trang chủ

**Component:** `RegisterPage.tsx`

**Features:**

- Validation form đầy đủ
- OTP input component với auto-focus và paste support
- Countdown timer để resend OTP (60s)
- Toast notification cho success/error messages

### 2. Đăng Nhập

**Flow:**

1. User nhập email và password
2. Gửi request đến `/auth/login`
3. Nhận access token và refresh token
4. Lưu vào localStorage
5. Redirect về trang chủ

**Component:** `LoginPage.tsx`

**Features:**

- Validation form
- Remember me (through refresh token)
- Toast notifications
- Google OAuth button

### 3. Đăng Nhập với Google

**Flow:**

1. User click "Sign in with Google"
2. Redirect đến `/auth/google` (backend Google OAuth)
3. Backend xử lý OAuth và redirect về `/login-success?token={accessToken}`
4. Frontend lấy token từ query params
5. Gọi API để lấy user profile
6. Lưu token và user info
7. Redirect về trang chủ

**Components:**

- `LoginPage.tsx` - nút Google login
- `LoginSuccessPage.tsx` - xử lý callback

### 4. Quên Mật Khẩu

**Flow:**

1. User nhập email
2. Gửi request đến `/auth/forgot-password`
3. Backend gửi OTP về email
4. Hiển thị form nhập OTP + new password
5. User nhập OTP và mật khẩu mới
6. Gửi request đến `/auth/reset-password`
7. Hiển thị success message và redirect về login

**Component:** `ForgotPasswordPage.tsx`

**Steps:**

- Step 1: Email input
- Step 2: OTP + New Password input
- Step 3: Success message

**Features:**

- Multi-step form với animation
- OTP input component
- Countdown timer để resend OTP
- Password confirmation validation

### 5. Đăng Xuất

**Flow:**

1. User click logout button
2. Gửi request đến `/auth/logout`
3. Clear localStorage
4. Redirect về trang chủ

**Location:** `Navbar.tsx` hoặc nơi có logout button

### 6. Toast Notifications

**Usage:**

```tsx
import { useToast } from '@/hooks/useToast';

const { toast } = useToast();

// Success
toast({
  title: 'Success',
  description: 'Action completed successfully',
});

// Error
toast({
  variant: 'destructive',
  title: 'Error',
  description: 'Something went wrong',
});
```

**Component:** `Toast.tsx`

## API Endpoints

### Backend Endpoints (NestJS)

1. **POST** `/auth/register`

   - Body: `{ email, password, name }`
   - Response: OTP sent to email

2. **POST** `/auth/verify-account`

   - Body: `{ email, password, otp }`
   - Response: `{ user, accessToken, refreshToken }`

3. **POST** `/auth/login`

   - Body: `{ email, password }`
   - Response: `{ user, accessToken, refreshToken }`

4. **POST** `/auth/logout`

   - Headers: `Authorization: Bearer {accessToken}`
   - Response: Success message

5. **POST** `/auth/forgot-password`

   - Body: `{ email }`
   - Response: OTP sent to email

6. **POST** `/auth/reset-password`

   - Body: `{ email, otp, newPassword, confirmPassword }`
   - Response: Success message

7. **GET** `/auth/google`

   - Redirect to Google OAuth

8. **GET** `/auth/google/callback`

   - Redirect to frontend: `/login-success?token={accessToken}`

9. **GET** `/auth/profile`

   - Headers: `Authorization: Bearer {accessToken}`
   - Response: User profile

10. **POST** `/auth/refresh`
    - Body: `{ refreshToken }`
    - Response: `{ accessToken }`

## Redux State Management

### Auth Slice State

```typescript
{
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  accessToken: string | null;

  // Register flow
  registerEmail: string | null;
  registerPassword: string | null;
  registerName: string | null;
  needsVerification: boolean;

  // Forgot password flow
  forgotPasswordSent: boolean;
  resetPasswordSuccess: boolean;
  otpError: string | null;
}
```

### Actions

- `loginUser(credentials)`
- `registerUser(payload)`
- `verifyAccount({ email, password, otp })`
- `logoutUser()`
- `getUserProfile()`
- `forgotPassword({ email })`
- `resetPassword({ email, otp, newPassword, confirmPassword })`
- `loginWithGoogle()`
- `handleGoogleCallback(token)`
- `resetError()`
- `resetForgotPassword()`
- `resetRegisterState()`

## Components

### OtpInput Component

```tsx
import { OtpInput, OtpInputRef } from '@/components/OtpInput';

const otpRef = useRef<OtpInputRef>(null);

<OtpInput
  ref={otpRef}
  length={6}
  onComplete={(otp) => handleVerify(otp)}
  error={hasError}
  disabled={loading}
/>;

// Methods
otpRef.current?.reset();
const otp = otpRef.current?.getOtp();
```

**Features:**

- Auto-focus next input
- Paste support
- Backspace navigation
- Error state with shake animation

## Environment Variables

Cần thiết lập trong `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Testing

### Test Flow Đăng Ký

1. Truy cập `/register`
2. Điền form đăng ký
3. Submit form
4. Kiểm tra email để lấy OTP
5. Nhập OTP vào form verification
6. Kiểm tra redirect về trang chủ và đã đăng nhập

### Test Flow Đăng Nhập

1. Truy cập `/login`
2. Nhập email/password đã đăng ký
3. Submit form
4. Kiểm tra redirect về trang chủ và đã đăng nhập

### Test Flow Google OAuth

1. Truy cập `/login`
2. Click "Sign in with Google"
3. Đăng nhập Google account
4. Kiểm tra redirect về trang chủ và đã đăng nhập

### Test Flow Quên Mật Khẩu

1. Truy cập `/forgot-password`
2. Nhập email
3. Kiểm tra email để lấy OTP
4. Nhập OTP và mật khẩu mới
5. Kiểm tra thông báo success
6. Login với mật khẩu mới

## Lưu Ý

1. **OTP Expiration:** OTP có thời hạn (thường 5-10 phút), backend cần xử lý
2. **Rate Limiting:** Cần implement rate limiting cho các API gửi OTP
3. **Security:**
   - Access token nên có thời hạn ngắn (15-30 phút)
   - Refresh token có thời hạn dài hơn (7-30 ngày)
   - Sử dụng HTTPS trong production
4. **Error Handling:** Đã xử lý đầy đủ các error cases với toast notifications
5. **Loading States:** Tất cả forms đều có loading state khi submit
6. **Validation:** Client-side validation cho UX, server-side validation vẫn cần thiết

## Troubleshooting

### Lỗi CORS

- Đảm bảo backend đã enable CORS cho frontend origin
- Check `configService.ts` trong backend

### Token Refresh Issues

- Check interceptor trong `api.utils.ts`
- Đảm bảo refresh token endpoint hoạt động

### OTP Không Nhận Được

- Check email service configuration
- Check spam folder
- Verify email service credentials

### Google OAuth Không Hoạt Động

- Verify Google OAuth credentials trong backend
- Check redirect URI trong Google Console
- Đảm bảo callback URL đúng

## Future Improvements

1. **Social Login:** Thêm Facebook, GitHub login
2. **2FA:** Two-factor authentication
3. **Remember Device:** Lưu device để không cần OTP lần sau
4. **Password Strength Meter:** Hiển thị độ mạnh password
5. **Email Verification Link:** Alternative cho OTP
6. **Biometric Login:** Fingerprint, Face ID (mobile)
