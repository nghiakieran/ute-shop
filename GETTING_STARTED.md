# 🚀 Hướng Dẫn Bắt Đầu - UTEShop

## 📋 Yêu Cầu Hệ Thống

- Node.js >= 20.0
- npm hoặc yarn
- Git

## 🎯 Cài Đặt và Chạy

### 1. Clone hoặc tạo project
```bash
cd UTEShop
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Sửa nội dung file `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 4. Chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

Server sẽ chạy tại: `http://localhost:3000`

### 5. Build production
```bash
npm run build
# hoặc
yarn build
```

## 📚 Cấu Trúc Dự Án

```
UTEShop/
├── src/
│   ├── components/     # UI components
│   ├── pages/         # Pages
│   ├── layouts/       # Layouts
│   ├── redux/         # Redux state
│   ├── types/         # TypeScript types
│   ├── utils/         # Utilities
│   ├── constants/     # Constants
│   ├── guards/        # Route guards
│   ├── hooks/         # Custom hooks
│   ├── providers/     # Providers
│   └── routes/        # Routes config
```

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Redux Persist** - State persistence
- **Vite** - Build tool

## 🔥 Features

### Authentication
- ✅ Login với email/password
- ✅ Register với validation
- ✅ Forgot password với OTP flow
- ✅ JWT token authentication
- ✅ Auto token refresh
- ✅ Protected routes

### User Profile
- ✅ View profile
- ✅ Update profile
- ✅ Change password
- ✅ Upload avatar

### UI/UX
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern, minimalist Western style
- ✅ Smooth animations with Framer Motion
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

## 🎯 Các Trang Chính

### 1. Home Page (`/`)
- Hero banner với slogan
- Featured categories
- About section
- Responsive layout

### 2. Login Page (`/login`)
- Email/password form
- Remember me checkbox
- Forgot password link
- Register link
- Auto redirect nếu đã login

### 3. Register Page (`/register`)
- Full name, email, phone, password
- Password strength validation
- Agree to terms checkbox
- Auto redirect nếu đã login

### 4. Forgot Password Page (`/forgot-password`)
- 3-step flow:
  1. Enter email → Send OTP
  2. Verify OTP
  3. Reset password
- Success confirmation

### 5. Profile Page (`/profile`)
- View user info
- Update profile
- Protected route (requires login)

## 🔐 Authentication Flow

### Login Flow
```
1. User enters email/password
2. Dispatch loginUser action
3. API returns { user, accessToken, refreshToken }
4. Save tokens to localStorage
5. Redirect to home page
```

### Auto Refresh Token
```
1. API returns 401 Unauthorized
2. Try to refresh token
3. If success: retry original request
4. If failed: clear tokens → redirect to login
```

### Protected Route
```
1. Check isAuthenticated from Redux
2. If true: render page
3. If false: redirect to /login
```

## 🎨 Design System

### Colors
- **Primary**: Beige/Tan (#b8845a)
- **Neutral**: Black to White (#171717 → #fafafa)
- **Accents**: Soft earth tones

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- **Button**: Primary, Secondary, Outline, Ghost variants
- **Input**: With label, error, helper text
- **Navbar**: Fixed, transparent → solid on scroll
- **Footer**: 4-column grid with newsletter

## 🚀 Redux Usage Examples

### Dispatch Action
```tsx
import { useAppDispatch } from '@/redux/hooks';
import { loginUser } from '@/redux/slices/auth.slice';

const dispatch = useAppDispatch();

// With error handling
try {
  await dispatch(loginUser({ email, password })).unwrap();
  navigate('/');
} catch (error) {
  console.error('Login failed:', error);
}
```

### Select State
```tsx
import { useAppSelector } from '@/redux/hooks';
import { selectUser, selectAuthLoading } from '@/redux/slices/auth.slice';

const user = useAppSelector(selectUser);
const loading = useAppSelector(selectAuthLoading);
```

### Custom Hook
```tsx
import { useAuth } from '@/hooks';

const { isAuthenticated, user, login, logout } = useAuth();
```

## 🛠️ Development Tips

### 1. Hot Reload
Vite hỗ trợ hot reload tự động khi save file

### 2. Type Safety
Sử dụng TypeScript để tránh lỗi runtime:
```tsx
// ✅ Good
const user: User = await dispatch(getUserProfile()).unwrap();

// ❌ Bad
const user = await dispatch(getUserProfile()).unwrap();
```

### 3. Redux DevTools
Cài extension Redux DevTools để debug state

### 4. Validation
Sử dụng validation utils có sẵn:
```tsx
import { validationUtils } from '@/utils';

const emailError = validationUtils.validateEmail(email);
const passwordError = validationUtils.validatePassword(password);
```

## 📖 Tài Liệu Bổ Sung

- [STRUCTURE.md](./STRUCTURE.md) - Cấu trúc chi tiết
- [REDUX_GUIDE.md](./REDUX_GUIDE.md) - Hướng dẫn Redux
- [README.md](./README.md) - Overview

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License

## 💡 Tips & Tricks

### Mock API
Nếu chưa có backend, bạn có thể:
1. Sử dụng JSON Server
2. Sử dụng MSW (Mock Service Worker)
3. Sử dụng Mirage JS

### Customization
- Colors: Sửa trong `tailwind.config.js`
- Fonts: Thêm link trong `index.html` và config trong `tailwind.config.js`
- API URL: Sửa trong `.env`

### Performance
- Code splitting với React.lazy()
- Image optimization
- Memoization với useMemo, useCallback
- Virtual scrolling cho danh sách dài

## 🐛 Common Issues

### Issue 1: Module not found
```bash
npm install
# hoặc xóa node_modules và install lại
rm -rf node_modules
npm install
```

### Issue 2: Tailwind không hoạt động
Check `tailwind.config.js` và đảm bảo `index.css` có import directives

### Issue 3: Redux Persist warning
Ignore serializable check warnings trong development - đã config sẵn

## 📞 Support

Nếu gặp vấn đề, hãy tạo issue trên GitHub hoặc liên hệ team.

---

Happy coding! 🎉

